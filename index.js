'use strict';

const joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const log = require('simple-node-logger').createSimpleLogger();

const db = require('lowdb')('db.json', {
    promise: true,
})('users');

const app = express();

app.use(cors());
// app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.set('view engine', 'ejs');

// password must contain at least one number or special character
// and be of mixed case
const passwordRegex = /^(?=.*[0-9!@#\$%\^\&*\)\(+=\._-])(?=.*[a-z])(?=.*[A-Z])(.*)$/;

const registrationSchema = {
    email: joi.string().required().email(),
    password: joi.string().required().min(8).regex(passwordRegex),
};

app.get('/', (req, res) => {
    res.render('index');
});


app.post('/register', (req, res) => {
    const validation = joi.validate(req.body, registrationSchema, {
        abortEarly: false,
        skipFunctions: true,
        stripUnknown: true,
    });

    if (validation.error) {
        res.render('index', { status: 400, message: 'Validation error!'});
    }

    return db.find({
        email: req.body.email,
    }).then((user) => {
        if (user) {
            res.render('index', { status: 409, message: `'${ req.body.email }' is already a registered email address` });
        }

        return db.push({
            email: req.body.email,
            password: req.body.password, // obviously unsafe
            created: Date.now(),
        });
    }).then((data) => {
        log.info(`'${ data[0].email }' registered`);

        return res.send({
            email: data[0].email,
            created: data[0].created,
        });
    }).catch((err) => {
        log.error(err.message);

        const conflict = err.message.indexOf('already a registered') >= 0;

        return res.status(conflict ? 409 : 500).send({
            message: err.message,
        });
    });
});


const server = app.listen(parseInt(process.env.PORT) || 5000, '0.0.0.0', () => {
    const address = server.address();
    const addr = address.address;
    const port = address.port;

    log.info(`Registration API at [POST] http://${ addr }:${ port }/register`);
    log.info(`Client application at http://${ addr }:${ port }/index.html`);
});

