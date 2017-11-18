var userController = require('./controllers/user');
var cookieController = require('./controllers/cookie');

module.exports = function(app){
    app.post("/api/v1/user", userController.getStarted);
    app.post("/api/v1/user/social", userController.socialLogin);
    app.get("/api/v1/user", cookieController.authenticate, userController.getUser); 
    app.post("/api/v1/user/profile", cookieController.authenticate, userController.updateUser);
    app.post("/api/v1/user/device", cookieController.authenticate, userController.updateDeviceInfo);
}