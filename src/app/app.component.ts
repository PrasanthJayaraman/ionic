import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';

import { WelcomePage } from '../pages/welcome/welcome';
import { Home } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {        
  public rootPage: any;  
  @ViewChild(Nav) nav: Nav;

  constructor(public storage: Storage, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public fb: Facebook) {          

    this.rootPage = Home;    

    platform.ready().then(() => {      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
  } 

  openHome(){
    this.nav.setRoot(Home);
  }

  logout() {    
    this.fb.logout()
      .then(res => console.log("FB logged out"))
      .catch(e => console.log('Error logout from Facebook', e));
    this.storage.clear();
    this.storage.set('page', "Welcome");
    setTimeout(() => {
      this.nav.push(WelcomePage);
    }, 100)    
  }

  
}
