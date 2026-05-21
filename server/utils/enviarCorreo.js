const nodemailer = require('nodemailer');

async function enviarCorreo(
    correoDestino,
    rutaPDF,
    nombrePDF
){

    const transporter =
        nodemailer.createTransport({

            service: 'gmail',

            auth: {

                user: 'gabysfloresk@gmail.com',

                pass: 'zdpb rlif mwfk xczv'

            }

        });

    const info =
        await transporter.sendMail({

            from: 'TU_CORREO@gmail.com',

            to: correoDestino,

            subject: 'Proforma de Compra',

            text: 'Adjunto encontrará su proforma.',

            attachments: [
                {
                    filename: nombrePDF,
                    path: rutaPDF
                }
            ]

        });

    return info;

}

module.exports = enviarCorreo;