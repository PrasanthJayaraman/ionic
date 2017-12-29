var admin = require("firebase-admin");
var path = require('path');
var jsonFile = path.join(__dirname, '..', 'jobswala-7a564-firebase-adminsdk-2i17m-5fe150b5fa.json');
admin.initializeApp({
    credential: admin.credential.cert(jsonFile)
});

exports.send = function(tokens, title, body){
   var registrationTokens = tokens;
   var payload = {
       notification : {
        "sound": "default",
        "icon": "fcm_push_icon"
       }
   };

   if (title) {
       payload.notification.title = title;
   }
   if (body) {
       payload.notification.body = body;
   }   

   console.log(payload);

   admin.messaging().sendToDevice(registrationTokens, payload)
    .then(function (response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", JSON.stringify(response));
    })
    .catch(function (error) {
        console.log("Error sending message:", error);
    });
}


/**
 * 
 *
 var FCM = require('fcm-node')
 var path = require('path');
 var jsonFile = path.join(__dirname, '..', 'jobswala-7a564-firebase-adminsdk-2i17m-5fe150b5fa.json');
 var serverKey = require(jsonFile); //put the generated private key path here    

 var fcm = new FCM(serverKey)

 exports.send = function (tokens, title, body) {
     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
         registration_ids: tokens,
         notification: {},
         priority: '10'
     }
     if (title) {
         message.notification.title = title;
     }
     if (body) {
         message.notification.body = body;
     }
     console.log(message);
     fcm.send(message, function (err, response) {
         if (err) {
             console.log("Something has gone wrong!", err);
         } else {
             console.log("Successfully sent with response: ", response)
         }
     })
 }

 */
