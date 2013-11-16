var mongoose = require('mongoose'),
  express = require("express"),
  fs = require("fs"),
  gm = require('gm'),
  imageMagick = gm.subClass({ imageMagick: true }),
  engine = require("ejs-locals"),
  passport = require('passport'),
  sys = require('sys'),
  exec = require('child_process').exec,
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
        res.redirect('tasks');
      });
    } else {
      res.render('index.ejs');
    }
});

app.get('/tasks', function(req, res) {
  User.findById(req.cookies.objectID, 'firstName facebookId URL tasks profilephoto', function(err, docs) {
    docs.currentpage = 'tasks';
    res.render('taskboard.ejs', docs);
  });
});

app.get('/deploy', function(req, res) {
  exec('./pull.sh', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
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
    res.cookie('objectID', req.user._id, { domain : ".getobjective.com" });
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
    docs.currentpage = 'settings';
    res.render('settings.ejs', docs);
  });
});
// temporarily upload file
app.post('/settings', function(req, res) {
  var item = req.files.profilephoto;
  // Illegal characters
  if(/^[a-zA-Z0-9- ]*$/.test(item.name) === true) {
    res.send({
      error: 'Oh no! Your image name contains special/illegal characters. Try again afer renaming your file to not have special characters.'
    });
    removeFile(item.path);
    return;
  }
  // Too Large (2MB)
  if (item.size > 2097152) {
    res.send({
      error: 'Your file is too large! It must be under 2mb. Yours is ' + Math.floor(item.size / 1024 * 0.001, 10) + 'mb'
    });
    removeFile(item.path);
    return;
  }
  // Wrong image format
  if (item.type !== 'image/png' && item.type !== 'image/jpg' && item.type !== 'image/jpeg' && item.type !== 'image/gif') {
    res.send({
      error: 'Invalid image format. PNG, JPG, and GIF files are only allowed'
    });
    return;
  }
  var tempPath = '/assets/images/temp/' + item.name, // for <img> tags to find images
      fullTempPath = __dirname + '/app/public' + tempPath; // for backend to find image
  fs.rename(item.path, fullTempPath,
    function(error) {
      // remove initial temp file
      removeFile(item.path);
      // Shrinks the image
      imageMagick(fullTempPath)
        .resize(200, 200)
        .write(fullTempPath, function(error) {
          if (error) console.log(error);
        });
      // Error on moving the temporary file to a perm temp path
      if(error) {
        console.log(error);
        res.send({
          error: 'Ah crap! Something bad happened while moving/deleting files.'
        });
        return;
      }
      // The path for the temp path that the ajax uses to show a preview of the image.
      res.send({
        path: tempPath
      });
    }
  );
});
// Finalize profile upload image
app.post('/settings/save', function(req, res) {
  var tempFile = __dirname + '/app/public' + req.body.permFile; //FUll path
  console.log(tempFile);
  var permFile = (req.body.tempPath).replace(/\/temp\//, '/uploads/'); // starts at /assets/
  fs.rename(tempFile, __dirname + '/app/public' + permFile,
    function(error) {
      removeFile(tempFile);
      if(error) {
        res.send({
          error: 'Ah crap! Something bad happened' + error
        });
        return;
      }
      User.findById(req.cookies.objectID, 'firstName facebookId URL tasks profilephoto', function(err, docs) {
        // Remove old photo
        removeFile(__dirname + '/app/public' + docs.profilephoto);
      });
      User.update({ _id: req.cookies.objectID }, { $set: {profilephoto: permFile}}, function (err, user) {
        if (err) {
          console.log("A mysterious error occured saving profilephoto to  " + req.cookies.objectID);
          console.log(err);
        }
        else {
          console.log("Success on the profile photo!");
        }
      });
      res.send({
        path: permFile
      });
    }
  );
});
// Removing files
function removeFile (file) {
  fs.unlink(file, function (err) {
    if (err) return;
    console.log('successfully deleted the file %s', file);
  });
  return;
}
app.get('/delete', function(req, res) {
  var id = req.query.id;
  User.update({'tasks._id':id}, { $pull: { tasks: {_id: id}}}, function (err) {
    if (err) { console.log(err); }
    res.redirect('tasks');
  });
});
