import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, ModalController, LoadingController, ToastController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { WelcomePage } from '../welcome/welcome';
import { HelperProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  @ViewChild(Slides) slides: Slides;

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
  public networkConn: any;
  public index: any;
  public heights = <any>{};  
  public categoryName;
  public categoryId;
  public pageHead;
  public alreadyCalled: Boolean;  

  constructor(public helper: HelperProvider, public loadingCtrl: LoadingController,
    public navParams: NavParams, public toast: ToastController, public network: Network, 
    public modalCtrl: ModalController, public navCtrl: NavController, public storage: Storage,
    public platform: Platform, public alertCtrl: AlertController, public firebase: Firebase, 
    public authService: AuthServiceProvider, public inAppBrowser: InAppBrowser) {
    
    this.pageHead = navParams.get("categoryName") || "Home";
    storage.set("pageHead", this.pageHead);    
    storage.set('page', 'Home');
    
    this.posts = [];       

    if(platform.is('cordova')){

    platform.ready().then(() => {            
        // Internet on disconnect watch
        this.disconnectSubscription = network.onDisconnect().subscribe(() => {
          if (this.networkConn) {
            this.networkConn = false;
            this.isOnline = false;
            this.toast.create({
              message: `No network connection!`,
              duration: 3000
            }).present();
          }
        }); 

        // Internet on connect watch
        this.connectSubscription = network.onConnect().subscribe(() => {
          if (!this.networkConn) {
            this.networkConn = true;
            setTimeout(() => {
              this.getData(this.pageHead, 1);  // Get new posts once connected to internet
            }, 3000);
          }
        });

        // Firebase Notification Open
        firebase.onNotificationOpen()
          .subscribe((notification) => {
            if (notification.tap) {
              this.alert(notification.body);
            } else {
              this.alert(notification.body);
            }
          });       
        
        // To show the get started popup after 40 secs of home loaded
        this.storage.get('isLoggedIn').then((val) => {
          if (!val) {
            this.storage.get('modal').then((modal) => {
              if(modal){
                setTimeout(() => {
                  let modal = this.modalCtrl.create(WelcomePage);
                  modal.present();
                }, 40 * 1000);
                this.storage.set("modal", false); // show only once then stop showing
              }
            });
          }                    
        });

        // Update the device token and device location everyday once & only app installs first time
        this.storage.get("firstTime", ).then((first) => {
          this.storage.get("limit").then((limit) => {
            if (!first) {              
              this.storage.set("firstTime", true);
              this.storage.set("limit", this.timestamp);
              this.helper.getDeviceId();  // Device unique UUID
              this.helper.registerPush(); // Device FCM push token
              this.helper.getLocation();  // Device GPS Location
            } else if(limit){              
              let now = new Date().getTime();
              let diff = this.helper.diffDays(now, limit);
              if (diff > 0) {
                this.alert("Updating device location and token");
                this.helper.registerPush();
                this.helper.getLocation();
                this.storage.set("limit", now);
              }
            }
          })
        });
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

  }

  ionViewDidLoad() {
      //this.getData(this.pageHead, 1);    
      if(this.platform.is('cordova')) {
      this.platform.ready().then(() => {        
        this.type = this.network.type;
        this.storage.set('page', 'Home');
        if (this.type == "unknown" || this.type == "none" || this.type == undefined) {
          this.isOnline = false;
          this.networkConn = false;
        } else {
          this.isOnline = true
          this.networkConn = true;
        }
        console.log("online", this.isOnline)
        if (this.isOnline) {
          this.getData(this.pageHead, 1);  // download data
        } else {          
          this.getStorageData();
        }        
      })   
    } 
  }  

  getStorageData(){    
    this.storage.get('pageHead')
    .then((pageHead) => {
      if(pageHead && pageHead == "Home"){
        this.storage.get('Home').then((posts) => {
          this.posts = posts;
        }, error => console.error("pro error", error))
      } else {
        this.storage.get(pageHead).then((posts) => {
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

  getData(page, index) {
    let loading = this.loadingCtrl.create({});
    loading.present();
    if (!index) { 
      index = 1;
    }       
    let url;
    if(page == "Home"){
      url = `posts/${index}`
    } else {
      url = `category/${page}/${index}`
    }     
    this.authService.getData(url)
      .then((res: any) => {
        this.alreadyCalled = false;
        this.index = index;
        let temp;
        try {
          temp = JSON.parse(res._body);
        } catch (e) {
          console.log('already obj');
          temp = res._body;
        }                
        let newPosts = this.helper.getPlatformHeight(temp.post);   
        if(newPosts && newPosts.length == 0){
          loading.dismiss();
          this.toast.create({
            message: `No more Posts`,
            duration: 3000
          }).present();
        } else {
          loading.dismiss();
          if(index > 1){
            this.posts.push(...this.helper.concatPostAndAd(newPosts, temp.ad));
            console.log(this.posts)
            this.data = temp;        
            setTimeout(() => {          
              this.helper.setOfflineDataReady(this.data);
            }, 3000);  
          } else {
            this.storage.get(page).then((oldposts) => {
              let allPosts = [];
              if(oldposts && oldposts.length > 0){
                allPosts = this.helper.removeDuplicates(newPosts, oldposts)
              } else {
                allPosts = newPosts;
              }
              this.posts.push(...this.helper.concatPostAndAd(allPosts, temp.ad));
              console.log(this.posts)
              this.data = temp;        
              setTimeout(() => {          
                this.helper.setOfflineDataReady(this.data);
              }, 3000);  
            });  
          }           
        }                 
      })
  }  

  openWithSystemBrowser(url: string) {
    const options: InAppBrowserOptions = {
      clearCache: 'no'
    }
    this.inAppBrowser.create(url, '_blank', options);
  }  

  doRefresh(e){
    this.alert("Trying to refresh the page");
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    if(this.slides.isEnd()){
      if(!this.alreadyCalled){
        this.alreadyCalled = true;
        this.index = this.index + 1;
        this.getData(this.pageHead, this.index);
      }      
    }
  }

}