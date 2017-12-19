var express = require('express');
var http = require('http');
var https = require("https");
var bodyParser = require("body-parser");
var cors = require('cors');
var ejs = require('ejs');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var DB = require("./db");
var favicon = require('serve-favicon')

// For ssl
var credentials = {
    key: fs.readFileSync('./certs/private.key', 'utf8'),
    cert: fs.readFileSync('./certs/certificate.crt', 'utf8'),
};

var app = express();

app.use(function (req, res, next) {
    if (req.secure) {
        next();
    } else {
        return res.redirect('https://' + req.get('host') + req.url);
    }
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb'}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, favicon.ico)));
app.use('/modules', express.static(__dirname + '/node_modules/'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use('/uploads', express.static(__dirname + '/uploads/'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var db = DB.connect(function(err){
    if(err){
        process.exit(-1);
    } else {
        DB.init(function(err){
            if(err){
                process.exit(-1);
            } else {
                require("./routes")(app);
                httpServer.listen(80, function () { console.log("HTTP server is UP and Running"); });

                httpsServer.listen(443, function () {
                    console.log("Secure server is UP and Running");
                });
            }
        });
    }
})