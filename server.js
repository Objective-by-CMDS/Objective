// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('yotDA5W4DvTFZREf');

var express = require("express");
var app = express();
var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

app.configure(function() {
    app.set('port', port);
    app.set("view options", {
        layout: false
    }); 
    app.engine('html', require('ejs').renderFile);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.listen(port);
console.log("Started listening on: " + port);
// add VoteKO and that root thingy later

app.get('/', function(req, res) {
    res.send('It has begun.');
});

