const net = require('net');

const client = net.createConnection({

    host: '177.7.42.180',

    port: 5000

});

client.on('data', (data) => {

    console.log('\nRESPUESTA:\n');

    console.log(
        JSON.parse(data.toString())
    );

});

client.on('connect', () => {

    console.log('Conectado al servidor');

    setTimeout(() => {

        client.write(JSON.stringify({

            tipo: 'COMPRA',

            cliente: 'Kenneth',

            correo: 'eter.kenth@gmail.com',

            productos: [

                {
                    id: 1,
                    cantidad: 1
                },

                {
                    id: 2,
                    cantidad: 2
                }

            ]

        }));

    }, 1000);

});