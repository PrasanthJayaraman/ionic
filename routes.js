var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },   
    filename: function (req, file, cb) {
        var extArray = file.mimetype.split("/");
        var extension = extArray[extArray.length - 1].toLowerCase();
        cb(null, Date.now() + '.' + extension) //Appending .jpg        
    }
});


var upload = multer({ storage: storage });


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
    app.get('/login', postController.showLogin);
    app.get('/', postController.showLogin);
    app.post('/user/login', postController.login);
    app.get('/posts/:index', postController.showPost);
    app.get('/post/create', postController.postForm);
    app.post('/post/create', postController.createPost);
    app.put('/post/create/:id', postController.updatePost);
    app.post('/post/image', upload.single('files'), postController.uploadImage);
    app.get('/post/edit/:id', postController.editPost);
    app.get('/post/delete/:id', postController.deletePost);
    app.post('/posts/search', postController.searchPost);
    
    // Category API
    app.get('/category/show', categoryController.listCategory);  
    app.get('/category/create', categoryController.categoryForm);  
    app.get('/category/edit/:id', categoryController.editCategory);
    app.put('/category/update/:id', categoryController.updateCategory);
    app.get('/category/delete/:id', categoryController.deleteCategory);
    app.post('/category/create', categoryController.createCategory);    
    
    // Push API
    app.get('/notification/create', pushController.createPush);
    app.post('/notification/send', pushController.sendPush);
}