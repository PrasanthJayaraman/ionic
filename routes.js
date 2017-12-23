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
var appController = require('./controllers/app.js');
var adController = require('./controllers/ads.js');

module.exports = function(app){
    // APP API
    app.post("/api/v1/user", userController.getStarted);
    app.post("/api/v1/user/social", userController.socialLogin);
    app.get("/api/v1/user", userController.getUser); 
    app.post("/api/v1/user/profile", userController.updateUser);
    app.post("/api/v1/user/device", userController.updateDeviceInfo);
    app.get("/api/v1/posts/:id", appController.getPosts);
    app.get("/api/v1/categories", appController.listCategory);    
    app.get("/api/v1/category/:name/:id", appController.getCategoryPost);
    app.get("/api/v1/ads", adController.listAd);
    app.get("/api/v1/share/link/:platform", appController.redirectToShareLink);

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

    // Ads API
    app.get('/ad/show', adController.listAd);
    app.get('/ad/create', adController.adForm);
    app.get('/ad/edit/:id', adController.editAd);
    app.put('/ad/update/:id', adController.updateAd);
    app.get('/ad/delete/:id', adController.deleteAd);
    app.post('/ad/create', adController.createAd);


}