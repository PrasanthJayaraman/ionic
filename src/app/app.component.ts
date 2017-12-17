import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { Home } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {        
  public rootPage: any;  
  @ViewChild(Nav) nav: Nav;
  public categories : Array<any>;

  constructor(public authService: AuthServiceProvider, public storage: Storage, public modalCtrl: ModalController,
    public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public fb: Facebook) {          

    this.rootPage = Home;    

    platform.ready().then(() => {      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.getCategories();
    });
  }  

  getCategories(){
    this.storage.get("categories")
    .then((cats) => {
      this.categories = cats || [];
      this.authService.getData("categories")
      .then((categories: any) => {
        var temp;
        try {
          temp = JSON.parse(categories._body);
        } catch(e){
          temp = categories._body;
        }
        this.categories = temp;
        this.storage.set("categories", temp);
      })
    });
  }

  openCategory(category){
    this.nav.push(Home, {      
      categoryName: category.name
    });
  }

  openHome(){    
    this.nav.push(Home);    
  }

  openProfile(){
    this.nav.push(ProfilePage);
  }

  openModal(){
    let modal = this.modalCtrl.create(WelcomePage);
    modal.present();
  }

  logout() {    
    this.fb.logout()
      .then(res => console.log("FB logged out"))
      .catch(e => console.log('Error logout from Facebook', e));
    this.storage.clear();      
  }

  
}