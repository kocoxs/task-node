const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SEND_GRID_KEY

sgMail.setApiKey(sendgridAPIKey);

const sendWelcome = (email, name) =>{

    const msg = {
        to: email,
        from: 'aaroncontreras1990@gmail.com',
        subject: 'Bienvenido a tu primer correo por send grid ',
        text: `Un super mensaje para el correo de bienvenida para ti ${name} `
    };
    
    sgMail.send(msg);
}

const sendCancelacion = (email, name) =>{
    const mensaje = {
        to:email,
        from: "aaroncontreras1990@gmail.com",
        subject: "cancelaste subscripcion",
        text: `bueno hasta ${name} aqui nos trajo el rio`
    }

    sgMail.send(mensaje);
}

module.exports = {
    sendWelcome,
    sendCancelacion
}