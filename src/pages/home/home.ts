import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController, ModalController, LoadingController, ToastController, NavParams, Slides, ActionSheetController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DomSanitizer } from '@angular/platform-browser';

import { WelcomePage } from '../welcome/welcome';
import { HelperProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

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
  public fetching: any;
  public calledLocal: any;

  constructor(public helper: HelperProvider, public loadingCtrl: LoadingController, public actionSheet: ActionSheetController,
    public navParams: NavParams, public toast: ToastController, public network: Network, public sanitizer: DomSanitizer,
    public modalCtrl: ModalController, public navCtrl: NavController, public storage: Storage,
    public platform: Platform, public alertCtrl: AlertController, public firebase: Firebase, 
    public authService: AuthServiceProvider, public inAppBrowser: InAppBrowser,  public socialSharing: SocialSharing) {
    
    this.pageHead = navParams.get("categoryName") || "Home";
    storage.set("pageHead", this.pageHead);    
    storage.set('page', 'Home');
    
    this.posts = [];       

    if(platform.is('cordova')){

    platform.ready().then(() => {            
        // Internet on disconnect watch
        this.disconnectSubscription = network.onDisconnect().subscribe(() => {
          this.isOnline = false;
          if(!this.calledLocal){
            this.getStorageData();
            /* this.toast.create({
              message: `No network connection!`,
              duration: 3000
            }).present();           */
          }   
        }); 

        // Internet on connect watch
        this.connectSubscription = network.onConnect().subscribe(() => {
          this.isOnline = true;
          this.calledLocal = false;
          setTimeout(() => {
            this.getData(this.pageHead, 1);  // Get new posts once connected to internet
          }, 3000);
        });

        // Firebase Notification Open
        firebase.onNotificationOpen()
          .subscribe((notification) => {
            if (notification.tap) {
              console.log("yes", JSON.stringify(notification));
              //this.alert(JSON.stringify(notification));
            } else {
              //this.alert(JSON.stringify(notification));
            }
          });       
        
        // To show the get started popup after 40 secs of home loaded
        this.storage.get('isLoggedIn').then((val) => {
          if (!val) {
            setTimeout(() => {
              this.showModal();
            }, 40 * 1000);
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
              this.helper.getShareURL();
            } else if(limit){              
              let now = new Date().getTime();
              let diff = this.helper.diffDays(now, limit);
              if (diff > 0) {
                this.alert("Updating device location and token");
                this.helper.getDeviceId();
                this.helper.registerPush();
                this.helper.getLocation();
                this.helper.getShareURL();
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

  showModal(){
    if(this.pageHead == "Home" && this.isOnline && !this.fetching){
      let modal = this.modalCtrl.create(WelcomePage);
      modal.present();
    }     
  }

  ionViewDidLoad() {      
      //this.isOnline = true; this.getData(this.pageHead, 1); 
      //this.getStorageData();
      if(this.platform.is('cordova')) {
      this.platform.ready().then(() => {        
        this.type = this.network.type;
        this.storage.set('page', 'Home');
        if (this.type == "unknown" || this.type == "none" || this.type == undefined) {
          this.isOnline = false;          
        } else {
          this.isOnline = true          
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
    this.calledLocal = true;
    this.toast.create({
      message: `No internet connection`,
      duration: 3000
    }).present();
    this.storage.get('pageHead')
    .then((pageHead) => {
      if(pageHead && pageHead == "Home"){
        this.storage.get('Home').then((posts) => {
          if(posts && posts.length > 0){
            this.posts = posts;
          } else {
            this.posts = [];
            this.toast.create({
              message: `No Posts to show, Connect to internet!`,
              duration: 3000
            }).present();
          }
        }, error => console.error("pro error", error))
      } else {
        this.storage.get(pageHead).then((posts) => {
          if(posts && posts.length > 0){
            this.posts = posts;
          } else {
            this.posts = [];
            this.toast.create({
              message: `No Posts to show, Connect to internet!`,
              duration: 3000
            }).present();
          }
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
    if(this.isOnline){
      this.fetching = true;
      let loading = this.loadingCtrl.create({
        spinner: "crescent"
      });
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
          this.fetching = false;
          this.alreadyCalled = false;
          this.index = index;
          let temp;
          try {
            temp = JSON.parse(res._body);
          } catch (e) {
            console.log('already obj');
            temp = res._body;
          }                
          let newPosts = this.helper.getPlatformHeight(temp.post, this.content.contentHeight);   
          let dataPack = JSON.parse(JSON.stringify(newPosts));
          if(newPosts && newPosts.length == 0){            
            this.toast.create({            
              message: `No more Posts`,
              duration: 3000
            }).present();            
            loading.dismiss();
            this.content.resize();
          } else {            
            loading.dismiss();
            if(index > 1){
              let postsWithAd = this.helper.concatPostAndAd(newPosts, temp.ad);
              this.posts.push(...postsWithAd);             
              this.content.resize();               
              this.toast.create({            
                message: `More Posts Below`,
                duration: 2000
              }).present();
            } else {              
              let concated = this.helper.concatPostAndAd(newPosts, temp.ad);
              this.posts = [];
              this.posts.push(...concated);            
              this.slides.slideTo(0);  
              this.data = dataPack;
              this.content.resize();
              //this.alert(this.content.contentHeight);
              this.helper.setOfflineDataReady(this.data);              
            }               
          }                 
        })  
      }
  }  

  openWithSystemBrowser(url: string) {
    const options: InAppBrowserOptions = {
      clearCache: 'no'
    }
    this.inAppBrowser.create(url, '_blank', options);
  }   

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    if(this.slides.isEnd()){
      if(!this.alreadyCalled){
        this.alreadyCalled = true;
        if(this.isOnline){
          this.index = this.index + 1;
          this.getData(this.pageHead, this.index);
        }        
      }      
    }
  }

  doRefresh() {  
    if(this.isOnline)  {
      this.getData(this.pageHead, 1);    
    } else {
      this.toast.create({
        message: `Please Connect to internet!`,
        duration: 3000
      }).present();
    }
  }

  showShare(title, imageURL){
    let appLink;    
    if(this.isOnline){      
      this.storage.get('share')
      .then((link) => {
        console.log("share", link);
        if(link){
          appLink = link;
        } else {
          appLink = imageURL;
        }
        let actionSheet = this.actionSheet.create({
          title: 'Share Via',
          buttons: [
            {
              text: 'Facebook',          
              handler: () => {
                console.log(title, imageURL)
                this.socialSharing.shareViaFacebook(title, "", appLink).then(() => {
                  console.log("shareViaWhatsApp: Success");
                }).catch((err) => {
                  console.error("share FB: failed", err);
                });
              }
            },
            {
              text: 'Watsapp',
              handler: () => {
                this.socialSharing.shareViaWhatsApp(title, "", appLink).then(() => {
                  console.log("shareViaWhatsApp: Success");
                }).catch((err) => {
                  console.error("shareViaWhatsApp: failed", err);
                });
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
     
        actionSheet.present();
      });      
    } else {
      this.toast.create({
        message: `Need Internet connection to share!`,
        duration: 3000
      }).present();
    }    
  }


}