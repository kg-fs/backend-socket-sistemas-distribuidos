const net = require('net');
const fs = require('fs');
const path = require('path');

const procesarCompra =
require('./utils/procesarCompra');

const generarPDF =
require('./utils/generarPDF');

const enviarCorreo =
require('./utils/enviarCorreo');

// cargar productos correctamente
const productos = JSON.parse(

    fs.readFileSync(

        path.join(__dirname, 'productos.json')

    )

);

const server = net.createServer((socket) => {

    console.log('Cliente conectado');

    // mensaje bienvenida
    socket.write(JSON.stringify({

        tipo: 'BIENVENIDA',

        mensaje: 'Conectado al socket server'

    }));

    // escuchar datos
    socket.on('data', async (data) => {

        try {

            // convertir mensaje
            const mensaje =
                JSON.parse(data.toString());

            console.log(
                'Mensaje recibido:',
                mensaje
            );

            switch (mensaje.tipo) {

                case 'CATALOGO':

                    socket.write(JSON.stringify({

                        tipo: 'CATALOGO_RESPONSE',

                        productos

                    }));

                break;

                case 'COMPRA':

                    // procesar compra
                    const resultado =
                        procesarCompra(

                            productos,

                            mensaje.productos

                        );

                    // datos factura
                    const datosCompra = {

                        cliente:
                            mensaje.cliente,

                        correo:
                            mensaje.correo,

                        ...resultado

                    };

                    console.log(
                        'Generando PDF...'
                    );

                    // generar pdf
                    const pdf =
                        await generarPDF(
                            datosCompra
                        );

                    console.log(
                        'PDF generado:',
                        pdf.nombreArchivo
                    );

                    console.log(
                        'Enviando correo...'
                    );

                    // enviar correo
                    await enviarCorreo(

                        mensaje.correo,

                        pdf.rutaArchivo,

                        pdf.nombreArchivo

                    );

                    console.log(
                        'Correo enviado'
                    );

                    // responder cliente
                    socket.write(JSON.stringify({

                        tipo:
                            'COMPRA_EXITOSA',

                        ...datosCompra,

                        pdf:
                            pdf.nombreArchivo

                    }));

                break;

                default:

                    socket.write(JSON.stringify({

                        tipo: 'ERROR',

                        mensaje:
                            'Tipo no reconocido'

                    }));

            }

        } catch (error) {

            console.log(
                'ERROR REAL:',
                error
            );

            socket.write(JSON.stringify({

                tipo: 'ERROR',

                mensaje: error.message

            }));

        }

    });

    socket.on('end', () => {

        console.log(
            'Cliente desconectado'
        );

    });

});

server.listen(5000, () => {

    console.log(
        'Servidor escuchando puerto 5000'
    );

});