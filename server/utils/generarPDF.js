const PDFDocument = require('pdfkit');

const fs = require('fs');

const path = require('path');

function generarPDF(datosCompra){

    return new Promise((resolve, reject) => {

        const nombreArchivo =
            `proforma_${Date.now()}.pdf`;

        const rutaArchivo = path.join(
            __dirname,
            '../proformas',
            nombreArchivo
        );

        const doc = new PDFDocument();

        const stream = fs.createWriteStream(
            rutaArchivo
        );

        doc.pipe(stream);

        // titulo
        doc.fontSize(20)
           .text('PROFORMA DE COMPRA');

        doc.moveDown();

        // cliente
        doc.fontSize(12)
           .text(`Cliente: ${datosCompra.cliente}`);

        doc.text(`Correo: ${datosCompra.correo}`);

        doc.moveDown();

        // productos
        doc.fontSize(14)
           .text('PRODUCTOS');

        doc.moveDown();

        datosCompra.detalle.forEach((producto) => {

            doc.fontSize(12)
               .text(
                `${producto.nombre} | Cantidad: ${producto.cantidad} | Total: $${producto.total}`
               );

        });

        doc.moveDown();

        // totales
        doc.text(`Subtotal: $${datosCompra.subtotal}`);

        doc.text(`IVA: $${datosCompra.iva}`);

        doc.text(`TOTAL: $${datosCompra.total}`);

        doc.end();

        stream.on('finish', () => {

            resolve({
                nombreArchivo,
                rutaArchivo
            });

        });

        stream.on('error', reject);

    });

}

module.exports = generarPDF;