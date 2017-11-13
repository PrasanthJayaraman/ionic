import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { Home } from '../home/home';
import { Platform } from 'ionic-angular/platform/platform';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  public user : FormGroup;
  
  alert(title, content) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Okay']
    });
    alert.present();
  }

  constructor(public storage: Storage, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public platform: Platform, private fb: Facebook) {
    storage.set('page', 'Welcome');
    
    this.user = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  login(form) {
    var data = this.user.value
    if(data.name == ""){
      return this.alert("Alert", "Please enter your name");
    } else if(data.name && data.name.length < 3){
      return this.alert("Alert", "Please enter a valid name");
    }

    if (!data.email) {
      return this.alert("Alert", "Please enter your email");
    } else if (data.email && !this.validateEmail(data.email)) {
      return this.alert("Alert", "Please enter a valid email");
    }

    if (!data.phone) {
      return this.alert("Alert", "Please enter your phone number");
    } else if (data.phone && data.phone.length < 10) {
      return this.alert("Alert", "Please enter a valid phone number");
    }
    this.storage.set('profile', data);
    this.storage.set('isLoggedIn', true);
    this.navCtrl.setRoot(Home);
  }

  loginFB(){
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', res);
        if(res.status == "connected"){
          this.getUserDetailFB(res.authResponse.userID)
        } else {
          this.alert("Alert", "You FB security is blocking, Please enter your details to get started!")
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetailFB(userid) {
    this.fb.api("/" + userid + "/?fields=id,email,name,gender", ["public_profile"])
      .then(res => {
        console.log(res);
        let detail = {
          name : res.name,
          gender : res.gender,
          email : res.email
        }        
        this.alert("Login",`${detail.name} ${detail.email} ${detail.gender}`)
        this.storage.set('profile', detail);
        this.storage.set('isLoggedIn', true);
        this.navCtrl.setRoot(Home);
      })
      .catch(e => {
        console.log(e);
      });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }  

}
