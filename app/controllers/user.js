
module.exports.getProfileWithId = function(req, res) {
	var id = req.params.id;
	User.find({_id: id}, function(err, docs) {
		res.send(JSON.stringify(docs));
	});
};