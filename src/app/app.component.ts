import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { Storage } from '@ionic/storage';

import { WelcomePage } from '../pages/welcome/welcome';
import { Home } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {        
  public rootPage: any;  
  @ViewChild(Nav) nav: Nav;

  public Android: Boolean = false;

  alert(title, content) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  constructor(public storage: Storage, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public firebase:Firebase, public alertCtrl:AlertController) {          

    storage.get('isLoggedIn').then((val) => {      
      //storage.remove('isLoggedIn');
      if (val) {
        this.rootPage = Home;
      } else {
        this.rootPage = WelcomePage;
      }
    });    

    platform.ready().then(() => {
      if(platform.is('android')){
        this.Android = true;
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (platform.is('cordova')) {
        this.registerPush();    
      }
    });
  } 

  openHome(){
    this.nav.setRoot(Home);
  }

  logout() {    
    this.storage.clear();
    this.storage.set('page', "Welcome");
    setTimeout(() => {
      this.nav.push(WelcomePage);
    }, 100)    
  }

  registerPush(){    
    if(this.Android){
      this.firebase.onTokenRefresh()
        .subscribe((token: string) => {
          console.log(`Got a new token ${token}`);
          this.storage.set("token", token);
        });

      this.firebase.onNotificationOpen()
        .subscribe((notification) => {
          console.log("Got", notification);
          if(notification.tap){
            this.alert("true", notification.tap);
          } else {
            this.alert("false", notification.tap);
          }
        });
    }       
   
  }
}
