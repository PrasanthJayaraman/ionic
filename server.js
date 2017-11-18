var express = require('express');
var bodyParser = require("body-parser");
var DB = require("./db");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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