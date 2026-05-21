const net = require('net');
const fs = require('fs');
const procesarCompra = require('./utils/procesarCompra');
const generarPDF = require('./utils/generarPDF');
const enviarCorreo = require('./utils/enviarCorreo');

const productos = JSON.parse(
    fs.readFileSync('./productos.json')
);

const server = net.createServer((socket) => {

    console.log('Cliente conectado');

    // mensaje de bienvenida
    socket.write(JSON.stringify({
        tipo: 'BIENVENIDA',
        mensaje: 'Conectado al socket server'
    }));

    // escuchar mensajes
    socket.on('data', async(data) => {

        try {

            const mensaje = JSON.parse(data.toString());

            console.log('Mensaje recibido:', mensaje);

            switch (mensaje.tipo) {

                case 'CATALOGO':

                    socket.write(JSON.stringify({
                        tipo: 'CATALOGO_RESPONSE',
                        productos
                    }));

                    break;

                case 'COMPRA':

                    const resultado = procesarCompra(
                        productos,
                        mensaje.productos
                    );

                    const datosCompra = {

                        cliente: mensaje.cliente,

                        correo: mensaje.correo,

                        ...resultado

                    };

                    const pdf = await generarPDF(datosCompra);
                    await enviarCorreo(

                        mensaje.correo,

                        pdf.rutaArchivo,

                        pdf.nombreArchivo

                    );

                    socket.write(JSON.stringify({

                        tipo: 'COMPRA_EXITOSA',

                        ...datosCompra,

                        pdf: pdf.nombreArchivo

                    }));

                    break;

                default:

                    socket.write(JSON.stringify({
                        tipo: 'ERROR',
                        mensaje: 'Tipo no reconocido'
                    }));

            }

        } catch (error) {

            console.log(error);

            socket.write(JSON.stringify({
                tipo: 'ERROR',
                mensaje: 'JSON inválido'
            }));

        }

    });

    socket.on('end', () => {

        console.log('Cliente desconectado');

    });

});

server.listen(5000, () => {

    console.log('Servidor escuchando puerto 5000');

});