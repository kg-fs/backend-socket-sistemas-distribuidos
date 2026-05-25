const net = require('net');

const client = new net.Socket();

client.connect(3000, '177.7.42.180', () => {

    console.log(
        'Conectado al servidor TCP'
    );

    setTimeout(() => {

        client.write(
            JSON.stringify({

                tipo: 'CATALOGO'

            }) + '\n'
        );

    }, 1000);

});

client.on('data', (data) => {

    console.log('\nRESPUESTA:\n');

    const mensajes = data
        .toString()
        .split('\n')
        .filter(m => m.trim() !== '');

    mensajes.forEach((m) => {

        console.log(
            JSON.parse(m)
        );

    });

});

client.on('close', () => {

    console.log(
        'Conexión cerrada'
    );

});

client.on('error', (error) => {

    console.log(
        'ERROR:',
        error.message
    );

});