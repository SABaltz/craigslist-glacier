require('dotenv').config();
const nodemailer = require('nodemailer')

let sendEmail =  function(href) {
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'samuelabaltz@gmail.com',
                pass: process.env.EMAILPASS
            }
        }
    );

    let mailOptions = {
        from: '"Sam" <samuelabaltz@gmail.com>', // sender address
        to: 'davidbaltz1@gmail.com', // list of receivers
        subject: 'New House Available',
        text: `${href}`, // the name of the template file i.e email.handlebars
        context: {
            name: "Slick", // replace {{name}} with Adebola
            company: 'Car Cleaning Company' // replace {{company}} with My Company
        }
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

}

module.exports = sendEmail
