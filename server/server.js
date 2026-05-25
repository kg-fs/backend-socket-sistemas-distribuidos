const net = require('net');
const fs = require('fs');
const path = require('path');

const procesarCompra =
    require('./utils/procesarCompra');

const generarPDF =
    require('./utils/generarPDF');

const enviarCorreo =
    require('./utils/enviarCorreo');

// cargar productos
const productos = JSON.parse(

    fs.readFileSync(

        path.join(__dirname, 'productos.json')

    )

);

// crear servidor TCP
const server = net.createServer((socket) => {

    console.log('Cliente conectado');

    // mensaje bienvenida
    socket.write(

        JSON.stringify({

            tipo: 'BIENVENIDA',

            mensaje:
                'Conectado al servidor TCP'

        }) + '\n'

    );

    // escuchar datos
    socket.on('data', async (data) => {

        try {

            const mensaje =
                JSON.parse(data.toString());

            console.log(
                'Mensaje recibido:',
                mensaje
            );

            switch (mensaje.tipo) {

                case 'CATALOGO':

                    socket.write(

                        JSON.stringify({

                            tipo:
                                'CATALOGO_RESPONSE',

                            productos

                        }) + '\n'

                    );

                    break;

                case 'COMPRA':

                    const resultado =
                        procesarCompra(

                            productos,

                            mensaje.productos

                        );

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

                    await enviarCorreo(

                        mensaje.correo,

                        pdf.rutaArchivo,

                        pdf.nombreArchivo

                    );

                    console.log(
                        'Correo enviado'
                    );

                    socket.write(

                        JSON.stringify({

                            tipo:
                                'COMPRA_EXITOSA',

                            ...datosCompra,

                            pdf:
                                pdf.nombreArchivo

                        }) + '\n'

                    );

                    break;

                default:

                    socket.write(

                        JSON.stringify({

                            tipo: 'ERROR',

                            mensaje:
                                'Tipo no reconocido'

                        }) + '\n'

                    );

            }

        } catch (error) {

            console.log(
                'ERROR REAL:',
                error
            );

            socket.write(

                JSON.stringify({

                    tipo: 'ERROR',

                    mensaje:
                        error.message

                }) + '\n'

            );

        }

    });

    socket.on('end', () => {

        console.log(
            'Cliente desconectado'
        );

    });

    socket.on('error', (error) => {

        console.log(
            'Error socket:',
            error.message
        );

    });

});

// iniciar servidor
server.listen(3000, '0.0.0.0', () => {

    console.log(
        'Servidor TCP escuchando puerto 3000'
    );

});