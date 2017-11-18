var userController = require('./controllers/user');
var cookieController = require('./controllers/cookie');

module.exports = function(app){
    app.post("/api/v1/user", userController.getStarted);
    app.get("/api/v1/user", cookieController.authenticate, userController.getUser);    
}