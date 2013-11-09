var mongoose = require('mongoose');

// Mongo code
mongoose.connect('mongodb://moin.2013.nodeknockout.com/objective');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema, User;
db.once('open', function callback () {

  var findOrCreate = require('mongoose-findorcreate');
  var taskSchema = mongoose.Schema({name:String, dueDate: Date, notes:String, URL:String, });
  userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    facebookId: Number,
    tasks: [taskSchema]
  });
  userSchema.plugin(findOrCreate);
  Task = mongoose.model('Task', taskSchema);
  User = mongoose.model('User', userSchema);
});


module.exports.getProfileWithId = function(req, res) {
	var id = req.params.id;
	User.find({_id: id}, function(err, docs) {
		res.send(JSON.stringify(docs));
	});
};