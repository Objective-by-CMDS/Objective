module.exports = function(app, controllers) {

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/auth/facebook', controllers.passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', controllers.passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	res.cookie('objectID', req.user._id);
	res.redirect('/');
});

// Task API
app.get('/get/profile/:id', function(req, res) {
	var id = req.params.id;
	User.find({_id: id}, function(err, docs) {
		res.send(JSON.stringify(docs));
	});
});

};