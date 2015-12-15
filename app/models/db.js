var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds059284.mongolab.com:59284/heroku_b0k5jqwp', function() {
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


