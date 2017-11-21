var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');
var ejs = require('ejs');
var path = require('path');

var DB = require("./db");

var app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/modules', express.static(__dirname + '/node_modules/'));
app.use('/assets', express.static(__dirname + '/assets/'));

var PORT = process.env.PORT || 3000;
var db = DB.connect(function(err){
    if(err){
        process.exit(-1);
    } else {
        DB.init(function(err){
            if(err){
                process.exit(-1);
            } else {
                require("./routes")(app);
                app.listen(PORT, function(){
                    console.log("Jobswala server is LIVE", PORT);
                })
            }
        });
    }
})