import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';

import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any = WelcomePage;
  public Android: Boolean = false;

  alert(title, content) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public firebase:Firebase, public alertCtrl:AlertController) {
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

  registerPush(){    
    if(this.Android){
      this.firebase.onTokenRefresh()
        .subscribe((token: string) => console.log(`Got a new token ${token}`));

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
