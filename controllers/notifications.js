var FCM = require('fcm-node')
var path = require('path');
var jsonFile = path.join(__dirname, '..', 'jobswala-7a564-firebase-adminsdk-2i17m-5fe150b5fa.json');
var serverKey = require(jsonFile); //put the generated private key path here    

var fcm = new FCM(serverKey)

exports.send = function(tokens, title, body){
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids: tokens,
        notification : {}      
    }
    if(title){
        message.notification.title = title;        
    }
    if(body){
        message.notification.body = body;
    }

    fcm.send(message, function (err, response) {        
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}
