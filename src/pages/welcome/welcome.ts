import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { Platform } from 'ionic-angular/platform/platform';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  public user: FormGroup;  
  public loading;

  alert(title, content) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Ok']
    });
    alert.present();
  }

  constructor(public viewCtrl: ViewController, public storage: Storage, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public platform: Platform, private fb: Facebook, public googlePlus: GooglePlus, public authService: AuthServiceProvider, public loadingCtrl: LoadingController) {
    storage.set('page', 'Welcome');    
    this.user = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });
    
  }

  login(form) {
    var data = this.user.value
    if (data.name == "") {
      return this.alert("Alert", "Please enter your name");
    } else if (data.name && data.name.length < 3) {
      return this.alert("Alert", "Please enter a valid name");
    }

    if (!data.email) {
      return this.alert("Alert", "Please enter your email");
    } else if (data.email && !this.validateEmail(data.email)) {
      return this.alert("Alert", "Please enter valid email");
    }

    if (!data.phone) {
      return this.alert("Alert", "Please enter your phone number");
    } else if (data.phone.length < 10 || data.phone.length > 10 || !this.validatePhone(data.phone)) {
      return this.alert("Alert", "Please enter valid phone number");
    }

    this.postLoginData('user', data);

  }

  postLoginData(url, data) {
    let loading = this.loadingCtrl.create({
      content: 'Loading, please wait...'
    });
    loading.present();
    let headers = {
      'Content-Type': 'application/json'
    };    
    let body = {
      user: data
    }

    this.storage.get("uuid").then((uuid) => {
      if(uuid){
        body.user.key = uuid;
        this.authService.postData(url, headers, body)
        .then((res: any) => {
          if (res.status && res.status == 200) {
            let data = JSON.parse(res._body);
            this.storage.set('profile', data).then(() => {
              this.storage.set('isLoggedIn', true).then(() => {
                loading.dismiss();
                //this.alert("Info", JSON.stringify(data));
                this.viewCtrl.dismiss();
              }, error => console.error("islogg error", error))
            }, error => console.error("pro error", error))
          } else {
            loading.dismiss();
            //this.alert("Error", res.data.message);
          }
        }, (err) => {
          loading.dismiss();        
          //this.alert("Error", err.data.message);
        })  
      } else {
        this.authService.postData(url, headers, body)
        .then((res: any) => {
          if (res.status && res.status == 200) {
            let data = JSON.parse(res._body);
            this.storage.set('profile', data).then(() => {
              this.storage.set('isLoggedIn', true).then(() => {
                loading.dismiss();
                //this.alert("Info", JSON.stringify(data));
                this.viewCtrl.dismiss();
              }, error => console.error("islogg error", error))
            }, error => console.error("pro error", error))
          } else {
            loading.dismiss();
            //("Error", res.data.message);
          }
        }, (err) => {
          loading.dismiss();        
          //this.alert("Error", err.data.message);
        })  
      }
    });        
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  loginFB() {    
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {        
        if (res.status == "connected") {
          this.getUserDetailFB(res.authResponse.userID)
        } else {
          this.alert("Alert", "You FB security is blocking, Please enter your details to get started!")
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  loginGoogle() {
    let loading = this.loadingCtrl.create({
      content: 'Fetching your facebook profile...'
    });
    this.googlePlus.login(
      {}).then((userData) => {
        loading.dismiss();        
        let detail = {
          name: userData.displayName,
          email: userData.email
        }
        this.postLoginData('user/social', detail);
      }).catch(err => console.error(err));
  }

  getUserDetailFB(userid) {
    let loading = this.loadingCtrl.create({
      content: 'Fetching your facebook profile...'
    });
    loading.present();
    this.fb.api("/" + userid + "/?fields=id,email,name,gender", ["public_profile"])
      .then(res => {
        loading.dismiss();
        let detail = {
          name: res.name,
          gender: res.gender,
          email: res.email
        }
        this.postLoginData('user/social', detail);
      })
      .catch(e => {
        console.log(e);
      });
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePhone(phone) {
    let regex = /^\d+$/;
    return regex.test(phone);
  }
}
