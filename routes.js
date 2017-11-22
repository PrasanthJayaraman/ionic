var userController = require('./controllers/user');
var cookieController = require('./controllers/cookie');
var postController = require('./controllers/posts.js');
var pushController = require('./controllers/push.js');
var categoryController = require('./controllers/category.js');

module.exports = function(app){
    // APP API
    app.post("/api/v1/user", userController.getStarted);
    app.post("/api/v1/user/social", userController.socialLogin);
    app.get("/api/v1/user", cookieController.authenticate, userController.getUser); 
    app.post("/api/v1/user/profile", cookieController.authenticate, userController.updateUser);
    app.post("/api/v1/user/device", cookieController.authenticate, userController.updateDeviceInfo);

    // Post API
    app.get('/', postController.showPost);
    app.get('/posts/:index', postController.showPost);
    app.get('/post/create', postController.postForm);
    app.post('/post/create', postController.createPost);
    app.get('/post/edit/:id', postController.editPost);
    app.get('/post/delete/:id', postController.deletePost);
    
    // Category API
    app.get('/category/create', categoryController.listCategory);  
    app.post('/category/create', categoryController.createCategory);    
    
    // Push API
    app.get('/notification/create', pushController.createPush);
}