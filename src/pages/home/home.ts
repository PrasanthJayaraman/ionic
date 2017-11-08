import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  constructor(public navCtrl: NavController, public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy) {    
    
  }

  ionViewDidLoad() {
    //this.getLocation();      
  }

  getLocation(){
    let options = {
      enableHighAccuracy : true
    };

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
     if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          this.geolocation.getCurrentPosition(options).then((resp) => {
            console.log(resp.coords.latitude, resp.coords.longitude);
            alert("Got your location")
          }).catch((error) => {
            console.log('Error getting location', error);
            alert(error);
          });
         },
          (error) => {
            console.log('Error requesting location permissions', error)
            alert(error);
          }
        );
      }
    }); 
    
  }

}
