module.exports = function(app, controllers) {

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/auth/facebook', controllers.passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', controllers.passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	res.cookie('objectID', req.user._id);
	res.redirect('/');
});

// Task API
app.get('/api/profile/:id', function(req, res) {
	var id = req.params.id;
	User.find({_id: id}, function(err, docs) {
		res.send(JSON.stringify(docs));
	});
});

app.get('/api/tasks/:id', function(req, res) {
  var id = req.params.id;
  User.find({_id: id}, 'tasks', function(err, docs) {
    res.send(JSON.stringify(docs));
  });
});

app.post('/api/add/task', function(req, res) {
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
});

};

