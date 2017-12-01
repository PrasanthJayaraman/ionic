import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {  
  public Error: any;
  public location: any;
  public timestamp = new Date().getTime();
  public posts : String[];

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public storage: Storage, public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy, public diagnostic: Diagnostic, public alertCtrl: AlertController, public firebase: Firebase, public authService: AuthServiceProvider) {
    storage.set('page', 'Home');
    platform.ready().then(() => {      

      this.getData(1);

      if (platform.is('cordova')) {

        storage.get('isLoggedIn').then((val) => {            
          if (!val) {
            setTimeout(() => {
              //this.navCtrl.setRoot(WelcomePage);
              let modal = this.modalCtrl.create(WelcomePage);
              modal.present();
            }, 10 * 1000);
          } 
        });            

        storage.get("firstTime",).then((first) => {
          storage.get("limit").then((limit) => {
            if(!first && !limit){
              this.registerPush();
              this.getLocation();
              storage.set("firstTime", true);
              storage.set("limit", this.timestamp);  
              this.alert("firsttime");
            } else {              
              let now = new Date().getTime();
              let diff = this.diffDays(now, limit);
              if(diff > 0){
                this.registerPush();
                this.getLocation();
                storage.set("limit", now);
              }
            }
          })
        });       
        
        firebase.onNotificationOpen()
        .subscribe((notification) => {
          console.log("Got", notification);
          if (notification.tap) {
            this.alert(notification.body);
          } else {
            this.alert(notification.body);
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
      let data = {
        location: [ resp.coords.latitude, resp.coords.longitude]        
      };      
      this.updateData(data);            
    }).catch((error) => {
      console.log('Error getting location', error);         
      this.alert(`Cannot read your location ${error}`);
    });
  }

  registerPush() {    
    this.firebase.hasPermission()
    .then((data) => {
      if(data.isEnabled){
        this.collectToken();
      } else {        
        this.firebase.grantPermission()
        .then((permission) => {          
          this.collectToken();
        }, (error) => console.log("error in getting permission", error))        
      }
    }, (error) => console.log("Error in checking push permission"))  
  }

  collectToken(){
    console.log("collect called");
    this.firebase.onTokenRefresh()
    .subscribe((token: string) => {       
      let data = {
        token: token
      }
      this.updateData(data);
      console.log(`Got a new token ${token}`);            
    }, (error) => console.log("error in getting tokens", error));      
  }
  
  diffDays(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
  }

  getData(index){
    if(!index){
      index = 1;
    }
          
    this.authService.getData('posts/'+index)
    .then((res: any) => {
      this.storage.set('index', index);
      try {
        var temp = JSON.parse(res._body);
      } catch(e) {
        console.log('already obj');
      }      
      this.posts = temp || res._body;
      console.log(this.posts);
    })
  }

  updateData(data){
    let headers = {
      'Content-Type' : 'application/json'      
    }        
    this.authService.postData('user/device', headers, data)
    .then((res: any) => {      
      console.log("Device data updated");
    })
  }

}
