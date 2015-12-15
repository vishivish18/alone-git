var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds057934.mongolab.com:57934/heroku_sbvdhv7v', function() {
    console.log('mongodb connected');
})
mongoose.connection.on('open', function(ref) {
    console.log('Connected to Mongo server...');
});




/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/not_alone',function(){
	console.log('mongodb connected');
})*/

module.exports = mongoose;


