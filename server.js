// add VoteKO and that root thingy later
// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('yotDA5W4DvTFZREf');
var mongoose = require('mongoose');
var express = require("express");

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

var app = express();
app.configure(function() {
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set("view options", {
        layout: false
    }); 
    app.engine('html', require('ejs').renderFile);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.listen(port);
console.log("Started listening on: " + port);

app.get('/', function(req, res) {
    res.render('index.html');
});

// Mongo code, Daniel will have to help me out here:
mongoose.connect('mongodb://moin.2013.nodeknockout.com/objective');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  var findOrCreate = require('mongoose-findorcreate')
  var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    facebookId: Number,
    task: [{name:String, dueDate: Date, notes:String, URL:String, }]
  })
  userSchema.plugin(findOrCreate);
  var User = mongoose.model('User', userSchema);
});

// Facebook Login Code
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 544341338985998,
    clientSecret: 'f73d3cc3000e547091bed93608c1dfa8',
    callbackURL: "http://www.moin.2013.nodeknockout.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));