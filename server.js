var mongoose = require('mongoose'),
  express = require("express"),
  fs = require("fs"),
  engine = require("ejs-locals"),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

var port = 8000;

var app = express();
app.engine('ejs', engine);
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
mongoose.connect('mongodb://getobjective.com/objective');

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
    tasks: [taskSchema],
    profilephoto: String
  });
  userSchema.plugin(findOrCreate);
  Task = mongoose.model('Task', taskSchema);
  User = mongoose.model('User', userSchema);
});

app.get('/', function(req, res) {
    if (typeof req.cookies.objectID != 'undefined') {
      User.findById(req.cookies.objectID, 'firstName facebookId URL tasks profilephoto', function(err, docs) {
        res.render('taskboard.ejs', docs);
      });
    } else {
      res.render('index.ejs');
    }
});

app.get('/tasks', function(req, res) {
  User.findById(req.cookies.objectID, 'firstName facebookId URL tasks profilephoto', function(err, docs) {
    res.render('taskboard.ejs', docs);
  });
});

// Facebook Login Code
passport.use(new FacebookStrategy({
    clientID: 544341338985998,
    // Dev: 570196463053329
    clientSecret: 'f73d3cc3000e547091bed93608c1dfa8',
    // Dev: '0d972e868bd1ced4ac069de6d263476b'
    callbackURL: "http://getobjective.com/auth/facebook/callback"
    // Dev: "http://localhost:8000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function(err, user, created) {
      if (err) { return done(err); }
      if (created) {
        User.update({ facebookId: profile.id }, { $set: {firstName: profile.name.givenName, lastName: profile.name.familyName, email: profile._json.email}}, function (err, user) {
          if (err) {
            console.log("A mysterious error occured saving user ID " + profile.id);
            console.log(err);
          }
          var facebookId = profile.id;
          var name = "Save Tasks with Objective";
          var notes = "Objective allows you to easily save the important things you need to do on the internet for later. To get started, just click the title of this task to add the bookmarklet to your browser.";
          var url = "getobjective.com/tasks#bookmarklet";
          var task = new Task({name: name, notes: notes, URL: url});
          User.update({facebookId: facebookId}, { $push: {tasks: task}}, function(err, user) {
            if(err) {
              console.log(err);
              console.log("An error occured adding your initial task, " + id + ", URL, " + url);
            }
          });
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
  console.log(task);
  User.update({_id: id}, { $push: {tasks: task}}, function(err, user) {
    if(err) {
      console.log(err);
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
app.get('/settings', function(req, res) {
  User.findById(req.cookies.objectID, 'firstName facebookId URL tasks profilephoto', function(err, docs) {
    res.render('settings.ejs', docs);
  });
});
app.post('/settings', function(req, res) {
  if(/^[a-zA-Z0-9- ]*$/.test(req.files.profilephoto.name) === true) {
    res.send({
      error: 'Oh no! Your image name contains special/illegal characters. Try again afer renaming your file to not have special characters.'
    });
    return;
  }
  var tempPath = '/assets/images/temp/' + req.files.profilephoto.name;
  fs.rename(req.files.profilephoto.path, __dirname + '/app/public' + tempPath,
    function(error) {
      fs.unlink(req.files.profilephoto.path, function (err) {
        if (err) return;
        console.log('successfully deleted first file:  %s', req.files.profilephoto.path);
      });
      if(error) {
        res.send({
          error: 'Ah crap! Something bad happened while moving/deleting files.'
        });
        return;
      }
      res.send({
        path: tempPath
      });
    }
  );
});
app.post('/settings/save', function(req, res) {
  var oldToFile = __dirname + '/app/public' + req.body.pathToFile //FUll path
    , pathToFile = (req.body.pathToFile).replace(/\/temp\//, '/uploads/'); // starts at /assets/
  console.log("New File: " + pathToFile + ", Old File: " + oldToFile);
  fs.rename(oldToFile, __dirname + '/app/public' + pathToFile,
    function(error) {
      fs.unlink(oldToFile, function (err) {
        if (err) return;
        console.log('successfully deleted %s', oldToFile);
      });
      if(error) {
        res.send({
          error: 'Ah crap! Something bad happened'
        });
        return;
      }
      User.findById(req.cookies.objectID, 'firstName facebookId URL tasks profilephoto', function(err, docs) {
        fs.unlink(__dirname + '/app/public' + docs.profilephoto, function (err) {
          if (err) return;
          console.log('successfully deleted old photo %s', __dirname + '/app/public' + docs.profilephoto);
        });
      });
      User.update({ _id: req.cookies.objectID }, { $set: {profilephoto: pathToFile}}, function (err, user) {
        if (err) {
          console.log("A mysterious error occured saving profilephoto to  " + req.cookies.objectID);
          console.log(err);
        }
        else {
          console.log("Success on the profile photo!");
        }
      });
      res.send({
        path: pathToFile
      });
    }
  );
});
app.get('/delete', function(req, res) {
  var id = req.query.id;
  User.update({'tasks._id':id}, { $pull: { tasks: {_id: id}}}, function (err) {
    if (err) { console.log(err); }
    res.redirect('tasks');
  });
});
