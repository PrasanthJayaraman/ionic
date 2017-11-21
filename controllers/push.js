exports.createPush = function(req, res, next){
    res.render('push', { options: optionsArray});
}

var optionsArray = ["ALL", "Tamil Nadu", "Karnataka"];