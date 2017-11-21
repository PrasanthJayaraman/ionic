var userController = require('./controllers/user');
var cookieController = require('./controllers/cookie');
var postController = require('./controllers/posts.js');
var pushController = require('./controllers/push.js');

module.exports = function(app){
    app.post("/api/v1/user", userController.getStarted);
    app.post("/api/v1/user/social", userController.socialLogin);
    app.get("/api/v1/user", cookieController.authenticate, userController.getUser); 
    app.post("/api/v1/user/profile", cookieController.authenticate, userController.updateUser);
    app.post("/api/v1/user/device", cookieController.authenticate, userController.updateDeviceInfo);

    app.get('/', postController.showPost);
    app.get('/post/create', postController.createPost);
    app.get('/post/edit/:id', postController.editPost);
    app.get('/category/create', postController.createCategory);
    app.get('/notification/create', pushController.createPush);
}