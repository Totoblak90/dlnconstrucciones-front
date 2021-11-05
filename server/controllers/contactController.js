const {
  validationResult
} = require('express-validator');
const nodemailer = require("nodemailer");

module.exports = {
  index: (req, res, next) => {
    var response = {
      meta: {
        status: 200,
      },
      data: {
        message: 'Contact Controller here (endpoint POST para form de contacto, enviar a Mail!! Paquete de node? y Dashboard de Admin?)'
      }
    }
    res.json(response)
  },
  contact: (req, res, next) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

      return res.json({
        meta: {
          status: 401
        },
        data: {
          errors: errors.errors,
          body: req.body
        }
      });

    } else {

      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'lnconstrucciones0@gmail.com',
            pass: 'pruebanodemailer'
          }
        });

        var mailOptions = {
          from: 'lnconstrucciones0@gmail.com',
          to: `${req.body.email}`,
          subject: 'Sending Email using Node.js',
          text: `${req.body.comment}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }

      main()
        .then(
        
          res.json({
            meta: {
              status: 200,
            },
            data: {
              email: req.body.email,
              comment: req.body.comment,
              message: 'Email Sent Correctly'
            }
          })
          
        )
        .catch(console.error);

    }

  },

}
