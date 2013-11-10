// add VoteKO and that root thingy later
// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('yotDA5W4DvTFZREf');
var mongoose = require('mongoose'),
  express = require("express"),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

var app = express();
app.configure(function() {
  app.set('port', port);
  app.set('views', __dirname + '/app/views');
  app.set("view options", {
      layout: false
  }); 
  app.set('view engine', 'ejs');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/app/public'));
});

app.listen(port);
console.log("Server listening on: " + port);

// Mongo code
mongoose.connect('mongodb://moin.2013.nodeknockout.com/objective');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema, User;
db.once('open', function callback () {
  var findOrCreate = require('mongoose-findorcreate');
  var taskSchema = mongoose.Schema({name:String, dueDate: Date, notes:String, URL:String, })
  userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    facebookId: Number,
    tasks: [taskSchema]
  })
  userSchema.plugin(findOrCreate);
  Task = mongoose.model('Task', taskSchema);
  User = mongoose.model('User', userSchema);
});

app.get('/', function(req, res) {
    if (typeof req.cookies.objectID != 'undefined') {
      User.findById(req.cookies.objectID, 'firstName facebookId URL tasks', function(err, docs) {
        res.render('taskboard.ejs', docs);
      });
    } else {
      res.render('index.ejs');
    }
});

app.get('/tasks', function(req, res) {
  User.findById(req.cookies.objectID, 'firstName facebookId URL tasks', function(err, docs) {
    res.render('taskboard.ejs', docs);
  });
});

// Facebook Login Code
passport.use(new FacebookStrategy({
    clientID: (isProduction ? 544341338985998 : 570196463053329),
    clientSecret: (isProduction ? 'f73d3cc3000e547091bed93608c1dfa8' : '0d972e868bd1ced4ac069de6d263476b'),
    callbackURL: (isProduction ? "http://moin.2013.nodeknockout.com/auth/facebook/callback" : "http://localhost:8000/auth/facebook/callback")
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function(err, user, created) {
      if (err) { return done(err); }
      if (created) {
        User.update({ facebookId: profile.id }, { $set: {firstName: profile.name.givenName, lastName: profile.name.familyName, email: profile._json.email, tasks: {name: "Save Tasks with Objective", URL: "moin.2013.nodeknockout.com/tasks#bookmarklet", notes: "Objective allows you to easily save the important things you need to do on the internet for later. To get started, just click the title of this task to add the bookmarklet to your browser."}}}, function (err, user) {
          if (err) { 
            console.log("A mysterious error occured saving user ID " + profile.id);
            console.log(err);
          }
        });
      } 
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.cookie('objectID', req.user._id);
    res.redirect('/tasks');
});

// Task API
app.get('/get/profile/:id', function(req, res) {
  var id = req.params.id;
  User.find({_id: id}, function(err, docs) {
    res.send(JSON.stringify(docs));
  });
});

app.get('/get/tasks/:id', function(req, res) {
  var id = req.params.id;
  User.find({_id: id}, 'tasks', function(err, docs) {
    res.send(JSON.stringify(docs));
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.clearCookie('objectID');
  res.redirect('/');
});

app.get('/add/task', function(req, res) {
  var id = req.query.id;
  var name = req.query.name;
  var notes = req.query.notes;
  var url = req.query.url;
  var task = new Task({name: name, notes: notes, URL: url});
  User.update({_id: id}, { $push: {tasks: task}}, function(err, user) {
    if(err) {
      console.log("An error occured adding your task, " + id + ", URL, " + url);
    }
  });
});

app.post('/add/task', function(req, res) { 
  console.log(req);
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
    console.log(user);
    res.send("{success: 1}");
  });
});

app.get('/delete/task/:id', function(req, res) {
  var id = req.params.id;
  User.update({'tasks._id':id}, { $pull: { tasks: {_id: id}}}, function (err) {
    if (err) { console.log(err); }
  });
});