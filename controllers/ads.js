var mongoose = require('mongoose');
var Ad = mongoose.model("Ad");
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var common = require("../common");

exports.listAd = function(req, res, next){
    console.log("inside");
    Ad.getAllAd(function(err, ads){
        if(err){
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            return res.render('adlist', { ads: ads });
        }
    })

}


exports.adForm = function (req, res, next) {
    return res.render('adform', {data: {}});
}


exports.editAd = function (req, res, next) {
    var id = req.params.id;

    if (!id || !ad.script) {
        return res.status(400).send({
            message: "Please check the inputs"
        })
    }

    Ad.findOne({ _id: id }, function (err, ad) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            var script = entities.decode(ad.script);
            ad.script = script;
            console.log(ad);
            res.render('adform', { data: ad })
        }
    })
}


exports.deleteAd = function (req, res, next) {
    var id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "Cannot edit the selected ad"
        })
    }

    Ad.remove({ _id: id }, function (err) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            return res.redirect('/ad/show');
        }
    })
}


exports.updateAd = function (req, res, next) {
    var id = req.params.id;
    var data = req.body.ad;

    console.log(data, id);

    if (!data.script || !id) {
        return res.status(400).send({
            message: "Cannot edit the selected ad"
        })
    }   

    Ad.findByIdAndUpdate({ _id: id }, { $set: { script: data.script, active: data.active, name: data.name, modified: common.getISTTime() } }, function (err, ad) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            res.send(200);
        }
    })
}


exports.createAd = function (req, res, next) {
    var ad = req.body.ad;    

    if (!ad || !ad.script || !ad.name) {
        return res.status(400).send({
            message: "Invalid Ad data"
        })
    }    

    var newObj = new Ad({
        script: ad.script,
        created: common.getISTTime(),
        modified: common.getISTTime(),
        active: ad.active,
        name: ad.name
    });

    newObj.save(function (err) {
        if (err) {
            return res.status(500).send({
                message: "Server is Busy, Please try again!"
            });
        } else {
            res.send(200);
        }
    })
}

