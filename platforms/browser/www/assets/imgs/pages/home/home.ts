import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  public Android : Boolean;  
  public Error : any;
  public location : any;

  constructor(public navCtrl: NavController, public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy, public diagnostic: Diagnostic, public alertCtrl: AlertController) {      
    platform.ready().then(() => {      
      this.Android = platform.is('android');
      if(platform.is('cordova')){
        this.getLocation();
      }
    });

  }  

  alert(content){
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: content,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getLocation(){
    let options = {
      enableHighAccuracy: true      
    };

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {        
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(() => {          
          this.geolocation.getCurrentPosition(options).then((resp) => {
            console.log(resp.coords.latitude, resp.coords.longitude);
            this.location = {
              "latitude" : resp.coords.latitude,
              "longitude" : resp.coords.longitude
            };
            this.alert(`${this.location.latitude} ${this.location.longitude}`);
          }).catch((error) => {
            console.log('Error getting location', error);            
            this.alert(`Cannot read your location 1 ${error}`);
          });
        },(error) => {
          console.log(error);
          this.alert(`Cannot read your location 2 ${error}`);
        });
      } else {
        this.geolocation.getCurrentPosition(options).then((resp) => {
          console.log(resp.coords.latitude, resp.coords.longitude);
          this.location = {
            "latitude": resp.coords.latitude,
            "longitude": resp.coords.longitude
          };
          this.alert(`${this.location.latitude} ${this.location.longitude}`);
        }).catch((error) => {
          console.log('Error getting location', error);
          this.alert(`Cannot read your location 3 ${error}`);
        });
      }
    });    

  }

}
