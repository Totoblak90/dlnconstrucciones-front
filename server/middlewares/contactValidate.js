const {check, body} = require('express-validator');
const path = require('path');
const fs = require('fs');

const ErrorsDir = path.join(__dirname, '..', 'data', 'catchErrorsLog.json');

module.exports = [
    check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Tiene que tener un formato de email válido'),
    check('comment')
    .isLength({min:10})
    .withMessage('Este campo debe contener al menos 10 carateres')
]