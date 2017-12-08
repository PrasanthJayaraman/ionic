import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  public Error: any;
  public location: any;
  public timestamp = new Date().getTime();
  public posts: any;
  public platformHeight: any;
  public data: any;
  public disconnectSubscription: any;
  public connectSubscription: any;
  public isOnline: any;
  public type: any;
  public current: any;
  public index: any;
  public heights = <any>{};
    
  constructor(public toast: ToastController, private network: Network, public modalCtrl: ModalController, public navCtrl: NavController, public storage: Storage,
    public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy,
    public diagnostic: Diagnostic, public alertCtrl: AlertController, public firebase: Firebase, public authService: AuthServiceProvider, public inAppBrowser: InAppBrowser) {
    storage.set('page', 'Home');
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.disconnectSubscription = network.onDisconnect().subscribe(() => {
          if (this.current) {
            this.current = false;
            this.isOnline = false;
          }
        });        

        this.connectSubscription = network.onConnect().subscribe(() => {
          if (!this.current) {
            this.current = true;
            setTimeout(() => {
              this.getData(1);
            }, 3000);
          }
        });

        firebase.onNotificationOpen()
          .subscribe((notification) => {
            if (notification.tap) {
              this.alert(notification.body);
            } else {
              this.alert(notification.body);
            }
          });

        this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
          this.toast.create({
            message: `No network connection!`,
            duration: 3000
          }).present();
        });
      }

    });

    platform.registerBackButtonAction((e) => {
      storage.get('page').then((page) => {
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
      });
    });

  }

  ionViewDidLoad() {
    //this.getData(1);
    //this.getPlatformHeight();
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.getPlatformHeight();
        this.type = this.network.type;
        this.storage.set('page', 'Home');
        if (this.type == "unknown" || this.type == "none" || this.type == undefined) {
          this.isOnline = false;
          this.current = false;
        } else {
          this.isOnline = true
          this.current = true;
        }
        console.log("online", this.isOnline)
        if (this.isOnline) {
          this.getData(1);  // download data
        } else {
          //show local data when no internet
          this.storage.get('posts').then((posts) => {
            this.posts = posts;
          }, error => console.error("pro error", error))
        }

        this.storage.get('isLoggedIn').then((val) => {
          if (!val) {
            setTimeout(() => {
              let modal = this.modalCtrl.create(WelcomePage);
              modal.present();
            }, 10 * 1000);
          }
        });

        this.storage.get("firstTime", ).then((first) => {
          this.storage.get("limit").then((limit) => {
            if (!first && !limit) {
              this.registerPush();
              this.getLocation();
              this.storage.set("firstTime", true);
              this.storage.set("limit", this.timestamp);
              this.alert("firsttime");
            } else {
              let now = new Date().getTime();
              let diff = this.diffDays(now, limit);
              if (diff > 0) {
                this.registerPush();
                this.getLocation();
                this.storage.set("limit", now);
              }
            }
          })
        });
      }
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

  fetchLocation() {
    let options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(options).then((resp) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
      let data = {
        location: [resp.coords.latitude, resp.coords.longitude]
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
        if (data.isEnabled) {
          this.collectToken();
        } else {
          this.firebase.grantPermission()
            .then((permission) => {
              this.collectToken();
            }, (error) => console.log("error in getting permission", error))
        }
      }, (error) => console.log("Error in checking push permission"))
  }

  collectToken() {
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
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

    return daysDifference;
  }

  getData(index) {
    if (!index) {
      index = 1;
    }
    this.posts = [];
    this.authService.getData('posts/' + index)
      .then((res: any) => {
        this.index = index;
        let temp;
        try {
          temp = JSON.parse(res._body);
        } catch (e) {
          console.log('already obj');
          temp = res._body;
        }        
        this.posts = temp;
        var localPosts = [];
        setTimeout(() => {
          temp.forEach(element => {                               
            element.image = this.getBase64(document.getElementById(element._id));
            localPosts.push(element);
          });
          this.updateStorage(localPosts);
        }, 3000)                
      })
  }

  getPlatformHeight(){
    this.platformHeight = this.platform.height();
    if (this.platform.is('ios')) {
      if (this.platformHeight == 812) {
        this.platformHeight -= 70; //iphone X
      } else {
        this.platformHeight -= 44;
      }
    }
    this.heights.slideH = `${this.platformHeight}px`;
    this.heights.imageH = `${Number(((30 / 100) * this.platformHeight).toFixed(1))}px`;
    this.heights.bodyH = `${Number(((68 / 100) * this.platformHeight).toFixed(1))}px`;
  }

  updateData(data) {
    let headers = {
      'Content-Type': 'application/json'
    }
    this.authService.postData('user/device', headers, data)
      .then((res: any) => {
        console.log("Device data updated");
      }, (error) => {
        console.log("device update error",error);
      })
      .catch((e) => {
        console.log("device update catch",e);
      })
  }

  openWithSystemBrowser(url: string) {
    const options: InAppBrowserOptions = {
      clearCache: 'no'
    }
    this.inAppBrowser.create(url, '_blank', options);
  }

  getBase64(img){
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
  }

  updateStorage(arr){    
    var oldPosts = []; //existing post available in localstorage
    var allPosts = []; // new posts to download images
    console.log("incoming",arr.length)
    this.storage.get('posts').then((posts: any) => {      
      console.log("posts length", posts && posts.length);      
      if(posts && posts.length > 0){  
        for(let i=0; i<arr.length; i++){          
          let newPosts = []; let existing = false;
          for(let j=0; j<posts.length; j++){
            if(arr[i] && posts[j]){
              if(arr[i]._id == posts[j]._id){  // If same post is coming then take add to old posts
                oldPosts.push(posts[j]);
                existing = true;
                break;
              } 
            }            
          }
          if(!existing && arr[i]){ // if it is a new post then take the new post
            newPosts.push(arr[i]);
          }
          allPosts.push(...newPosts);
        }          
      } else {
        allPosts = [...arr];  // if localstorage is empty save current posts
      }   
      console.log("oldPosts", oldPosts.length);      
      console.log("allPosts", allPosts.length);
      var finalArr = [];      
      finalArr.push(...oldPosts);
      finalArr.push(...allPosts);
      console.log("finalArr lrngth", finalArr.length);
      this.storage.set('posts', finalArr);
      this.storage.get('posts').then((posts) => {
        //console.log("final", JSON.stringify(posts));
      });    
    });
  }

}
