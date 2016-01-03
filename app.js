"use-strict"

var express = require('express');
var router = express.Router(); // get an instance of the express Router


var bodyParser = require('body-parser');
var app = express();


app.use('/api/route', router);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use(require('./config/auth'))

app.use('/api/users', require('./app/controllers/api/users'))
app.use('/api/sessions', require('./app/controllers/api/sessions'))
app.use('/', require('./app/controllers/static'))



var port = process.env.PORT || 1805

var io = require('socket.io').listen(app.listen(port, function() {
    console.log('Magic happens at ', port);
}));



require('./routes')(app, io);
