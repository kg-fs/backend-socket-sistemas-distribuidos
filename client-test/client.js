const WebSocket = require('ws');

const socket = new WebSocket(
    'ws://177.7.42.180:5000'
);

socket.on('open', () => {

    console.log(
        'Conectado al servidor'
    );

    setTimeout(() => {

        socket.send(JSON.stringify({

            tipo: 'CATALOGO'

        }));

    }, 1000);

});

socket.on('message', (data) => {

    console.log('\nRESPUESTA:\n');

    console.log(
        JSON.parse(data.toString())
    );

});

socket.on('close', () => {

    console.log(
        'Conexión cerrada'
    );

});

socket.on('error', (error) => {

    console.log(
        'ERROR:',
        error.message
    );

});