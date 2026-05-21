const net = require('net');

const client = net.createConnection({

    host: '127.0.0.1',
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

});