module.exports = function(app, controllers) {

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/auth/facebook', controllers.passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', controllers.passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	res.cookie('objectID', req.user._id);
	res.redirect('/');
});

app.get('/api/profile/:id', controllers.userController.getProfileWithId);

app.get('/api/tasks/:id', controllers.taskController.getTaskWithId);

app.post('/api/add/task', controllers.taskController.addTask);

};

