const express = require('express');
const server = express();
const config = require('./configuration');

const Port = config.port;


server.use(express.static(__dirname + '/client'));
server.get('/', (req, res) => {
    res.sendFile('/index.html');
});
server.listen(Port, () => {
    console.log('Webserver running on port: '+Port);
});
