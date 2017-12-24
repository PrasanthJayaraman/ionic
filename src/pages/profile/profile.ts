import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public user: FormGroup;  

  alert(title, content) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Ok']
    });
    alert.present();
  }

  constructor(public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    storage.set('page', 'Profile');    
    this.storage.get("profile")
    .then((profile: any) => {
      if(profile){
        this.user = this.formBuilder.group({
          name: [profile.name || '', Validators.required],
          email: [profile.email || '', Validators.required],
          phone: [profile.phone || '', Validators.required],
          gender: [profile.gender || '', Validators.required]          
        });
      } else {
        this.user = this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', Validators.required],
          phone: ['', Validators.required],
          gender: ['', Validators.required]          
        });
      }      
    })          

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

  updateUserData(form){
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

    if (!data.gender) {
      return this.alert("Alert", "Please select your gender");
    } else if (data.gender != "male" && data.gender != "female") {
      return this.alert("Alert", "Please select your gender");
    }

    this.postLoginData('user', data);
  }

  changeStatus(gender){
    console.log("gender", gender);
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
    this.authService.postData(url, headers, body)
      .then((res: any) => {
        if (res.status && res.status == 200) {
          let data = JSON.parse(res._body);
          this.storage.set('profile', data).then(() => {
            this.storage.set('isLoggedIn', true).then(() => {
              loading.dismiss();
              this.alert("Success", "Successfully saved your profile");
              this.navCtrl.pop();
            }, error => console.error("islogg error", error))
          }, error => console.error("pro error", error))
        } else {
          loading.dismiss();
          this.alert("Error", res.data.message);
        }
      }, (err) => {
        loading.dismiss();        
        this.alert("Error", err.data.message);
      })

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
