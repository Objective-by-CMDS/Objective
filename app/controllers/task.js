
module.exports.getTaskWithId = function(req, res) {
	var id = req.params.id;
	User.find({_id: id}, 'tasks', function(err, docs) {
		res.send(JSON.stringify(docs));
	});
};

module.exports.addTask = function(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var dueDate = req.body.dueDate;
	var notes = req.body.notes;
	var URL = req.body.URL;
	var task = new Task({name: name, dueDate: dueDate, notes: notes, URL: URL});

	User.update({_id: id}, { $push: {tasks: task}}, function(err, user) {
		if(err) {
			console.log("An error occured adding your task.");
			console.log(err);
			res.send("{success: 0}");
		}
		res.send("{success: 1}");
	});

};