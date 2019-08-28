const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const server = express();
const Users = require('../users/users-model');

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/api', (req, res) => {
    res.send('webauth-iii-challenge');
});

server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({ message: `JWT for ${user.id}`,
                    token
                });
            } else {
                res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

server.get('/api/users', (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err))
});

function generateToken(user) {
    const payload = {
        subject: 'user id',
        name: user.id
    };

    const secret = 'zipon';

    const options = {
        expiresIn: '1h'
    };

    return token = jwt.sign(payload, secret, options);
};

module.exports = server;