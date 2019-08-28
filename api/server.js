const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/api', (req, res) => {
    res.send('webauth-iii-challenge');
});

module.exports = server;