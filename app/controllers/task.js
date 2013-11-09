
module.exports.getTaskWithId = function(req, res) {
	var id = req.params.id;
	User.find({_id: id}, 'tasks', function(err, docs) {
		res.send(JSON.stringify(docs));
	});
};