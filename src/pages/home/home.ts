import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ModalController, ToastController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { DomSanitizer } from '@angular/platform-browser';

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
  public data = <any>{};
  public disconnectSubscription: any;
  public connectSubscription: any;
  public isOnline: any;
  public type: any;
  public current: any;
  public index: any;
  public heights = <any>{};  
  public categoryName;
  public categoryId;
  public pageHead;
  

  constructor(private uniqueDeviceID: UniqueDeviceID, public navParams: NavParams, public toast: ToastController, private network: Network, public modalCtrl: ModalController, public navCtrl: NavController, public storage: Storage,
    public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy,
    public diagnostic: Diagnostic, public alertCtrl: AlertController, public firebase: Firebase, public authService: AuthServiceProvider, public inAppBrowser: InAppBrowser, public sanitizer: DomSanitizer) {
    
    this.pageHead = navParams.get("categoryName") || "Home";
    storage.set("pageHead", this.pageHead);    
    storage.set('page', 'Home');
    
    this.posts = [];       

    platform.ready().then(() => {      
      this.posts = [];

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

  }

  ionViewDidLoad() {
    this.getData(1);    
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {        
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
          this.getStorageData();
        }

        this.storage.get('isLoggedIn').then((val) => {
          if (!val) {
            setTimeout(() => {
              let modal = this.modalCtrl.create(WelcomePage);
              modal.present();
            }, 40 * 1000);
          }
        });

        this.storage.get("firstTime", ).then((first) => {
          this.storage.get("limit").then((limit) => {
            if (!first) {              
              this.storage.set("firstTime", true);
              this.storage.set("limit", this.timestamp);
              this.getDeviceId();
              this.registerPush();
              this.getLocation();
            } else if(limit){              
              let now = new Date().getTime();
              let diff = this.diffDays(now, limit);
              if (diff > 0) {
                this.alert("Updating device location and token");
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

  getStorageData(){    
    this.storage.get('pageHead')
    .then((pageHead) => {
      if(pageHead && pageHead == "Home"){
        this.storage.get('posts').then((posts) => {
          this.posts = posts;
        }, error => console.error("pro error", error))
      } else {
        this.storage.get('categoryposts').then((posts) => {
          this.posts = posts;
        }, error => console.error("pro error", error))
      }
    })       
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

  getDeviceId(){
    this.uniqueDeviceID.get()
    .then((uuid: any) => {
      console.log("Device Id",uuid)
      this.storage.set("uuid", uuid);      
    })
    .catch((error: any) => {
      console.log(error)
      this.storage.set("uuid", "");
    });
  }

  collectToken() {    
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
        //this.posts = temp.post;
        var localPosts = [];
        this.platformHeight = this.platform.height();
        if (this.platform.is('ios')) {
          if (this.platformHeight == 812) {
            this.platformHeight -= 70; 
          } else {
            this.platformHeight -= 44;
          }
        }
        var heights = <any>Object;
        heights.slideH = `${this.platformHeight}px`;
        heights.imageH = `${Number(((30 / 100) * this.platformHeight).toFixed(1))}px`;
        heights.bodyH = `${Number(((68 / 100) * this.platformHeight).toFixed(1))}px`;
        console.log("heights", heights.slideH, heights.imageH, heights.bodyH);
        var result = temp.post.map(function(o) {
          o.slideH = heights.slideH,
          o.imageH = heights.imageH,
          o.bodyH = heights.bodyH
          return o;
        })
        this.posts = result;
        setTimeout(() => {
          temp.post.forEach(element => {                               
            element.image = this.getBase64(document.getElementById(element._id));            
            localPosts.push(element);
          });          
          this.posts = localPosts;
          this.updateStorage(localPosts);
        }, 5000)                
      })
  }

  updateData(data) {
    let headers = {
      'Content-Type': 'application/json'
    }
    this.storage.get("uuid").then((uuid) => {
        if(uuid){
          data.key = uuid;
          this.alert(`${JSON.stringify(data)}`)
          this.authService.postData('user/device', headers, data)
          .then((res: any) => {
            console.log("Device data updated");
          }, (error) => {
            console.log("device update error",error);
            this.storage.set("firstTime", false);
          })
          .catch((e) => {
            console.log("device update catch",e);
            this.storage.set("firstTime", false);
          })
        }
    });    
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
      return this.sanitizer.bypassSecurityTrustUrl(dataURL);

  }
  
  updateStorage(arr){    
    var oldPosts = []; //existing post available in localstorage
    var allPosts = []; // new posts to download images    
    this.storage.get('posts').then((posts: any) => {            
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
      var finalArr = [];      
      finalArr.push(...oldPosts);
      finalArr.push(...allPosts);      
      this.storage.set('posts', finalArr);
      this.storage.get('posts').then((posts) => {
        //console.log("final", JSON.stringify(posts));
      });    
    });
  }

  doRefresh(e){
    this.alert("Trying to refresh the page");
  }

}
