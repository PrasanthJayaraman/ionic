import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {  
  public Error: any;
  public location: any;

  constructor(public navCtrl: NavController, public storage: Storage, public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy, public diagnostic: Diagnostic, public alertCtrl: AlertController, public firebase: Firebase) {
    storage.set('page', 'Home');
    platform.ready().then(() => {
      
      if (platform.is('cordova')) {
        this.registerPush();
        storage.get("location").then(location => {
          if (location) {
            console.log("Location alerady available", location);
          } else {
            this.getLocation();
          }
        }, error => console.error("Location fetch error", error))

        firebase.onNotificationOpen()
        .subscribe((notification) => {
          console.log("Got", notification);
          if (notification.tap) {
            this.alert(notification.tap);
          } else {
            this.alert(notification.tap);
          }
        });
      }
    });

    platform.registerBackButtonAction((e) => {
      storage.get('page').then((page) => {
        if (page == "Home") {
          let alert = alertCtrl.create({
            title: 'Confirm',
            message: 'Do you want to exit?',
            buttons: [{
              text: "exit?",
              handler: () => { this.exitApp() }
            }, {
              text: "Cancel",
              role: 'cancel'
            }]
          })
          alert.present();
        } else if (page == "Welcome") {
          this.exitApp();
        }
      });
    });
  }

  exitApp() {
    this.platform.exitApp();
  }

  alert(content) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: content,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(() => {
          this.fetchLocation();
        }, (error) => {
          console.log(error);            
          this.alert(`Cannot read request your location ${error}`);
        });
      } else {
        this.fetchLocation();
      }
    });
  }

  fetchLocation(){
    let options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(options).then((resp) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
      this.location = {
        "latitude": resp.coords.latitude,
        "longitude": resp.coords.longitude
      };
      this.alert(`${this.location.latitude} ${this.location.longitude}`);
      this.storage.set("location", this.location).then(() => {
        console.log("Location set succesfully");
      }, (error) => console.log("error reading loc", error))
    }).catch((error) => {
      console.log('Error getting location', error);
      this.storage.set("location", "");      
      this.alert(`Cannot read your location ${error}`);
    });
  }

  registerPush() {
    console.log("register push called");
    
    this.firebase.hasPermission()
    .then((data) => {
      if(data.isEnabled){
        this.collectToken();
      } else {
        console.log("Push not permitted");
        this.firebase.grantPermission()
        .then((permission) => {
          console.log("asked for permission", permission);
          this.collectToken();
        }, (error) => console.log("error in getting permission", error))        
      }
    }, (error) => console.log("Error in checking push permission"))  
  }

  collectToken(){
    console.log("collect called");
    this.firebase.onTokenRefresh()
    .subscribe((token: string) => {
      debugger;
      console.log(`Got a new token ${token}`);
      this.storage.set("token", token);
    }, (error) => console.log("error in getting tokens", error));      
  }

  
}
