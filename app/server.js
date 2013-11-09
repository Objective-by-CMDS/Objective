// add VoteKO and that root thingy later
// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins

require('nko')('yotDA5W4DvTFZREf');
var mongoose = require('mongoose'),
	express = require("express"),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80:8000);
var app = express();
app.configure(function() {
	app.set('port', port);
	app.set('views', __dirname + '/views');
	app.set("view options", {
			layout: false
	});
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(passport.session());
	app.engine('html', require('ejs').renderFile);
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

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
				User.update({ facebookId: profile.id }, { $set: {firstName: profile.name.givenName, lastName: profile.name.familyName, email: profile._json.email}}, function (err, user) {
					console.log("A mysterious error occured saving user ID " + profile.id);
					console.log(err);
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

// Controllers
var userController = require('./controllers/user.js');
var taskController = require('./controllers/tasks.js');

// Router
require("./routes.js")(app, {
	userController :userController,
	taskController :taskController,
	passport: passport
});

app.use(app.router);

app.listen(port);
console.log("Server listening on: " + port);

