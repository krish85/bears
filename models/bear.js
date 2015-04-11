var mongoose = require('mongoose');

var BearSchema = new mongoose.Schema({
	name : String
});

module.exports = mongoose.model('Bear', BearSchema);

