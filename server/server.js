const WebSocket = require('ws');
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

// crear servidor websocket
const wss = new WebSocket.Server({

    host: '0.0.0.0',
    port: 5000

});

wss.on('connection', (ws) => {

    console.log('Cliente conectado');

    // bienvenida
    ws.send(JSON.stringify({

        tipo: 'BIENVENIDA',

        mensaje: 'Conectado al WebSocket server'

    }));

    // escuchar mensajes
    ws.on('message', async (data) => {

        try {

            const mensaje =
                JSON.parse(data.toString());

            console.log(
                'Mensaje recibido:',
                mensaje
            );

            switch (mensaje.tipo) {

                case 'CATALOGO':

                    ws.send(JSON.stringify({

                        tipo:
                            'CATALOGO_RESPONSE',

                        productos

                    }));

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

                    ws.send(JSON.stringify({

                        tipo:
                            'COMPRA_EXITOSA',

                        ...datosCompra,

                        pdf:
                            pdf.nombreArchivo

                    }));

                    break;

                default:

                    ws.send(JSON.stringify({

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

            ws.send(JSON.stringify({

                tipo: 'ERROR',

                mensaje:
                    error.message

            }));

        }

    });

    ws.on('close', () => {

        console.log(
            'Cliente desconectado'
        );

    });

});

console.log(
    'Servidor WebSocket escuchando puerto 5000'
);