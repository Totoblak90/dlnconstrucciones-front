const { validationResult } = require('express-validator');

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
            // Implementar nodemailer para formulario de contacto
            console.log(`email: ${req.body.email}`)
            console.log(`comment: ${req.body.comment}`)
            var response = {
                meta: {
                    status: 200,
                },
                data: {
                    email: req.body.email,
                    comment: req.body.comment,
                    message: 'Contact Controller here (endpoint POST para form de contacto) - Falta implementar nodemailer por back y re-captcha por front'
                }
            }
            res.json(response)

        }

    },

}