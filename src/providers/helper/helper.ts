import { Injectable } from '@angular/core';
import { Platform, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';

@Injectable()
export class HelperProvider {
  public platformHeight: any;
  
    constructor(private uniqueDeviceID: UniqueDeviceID, public toast: ToastController, public modalCtrl: ModalController, public storage: Storage,
      public platform: Platform, public geolocation: Geolocation, public locationAccuracy: LocationAccuracy, 
      public diagnostic: Diagnostic, public alertCtrl: AlertController, public firebase: Firebase, public authService: AuthServiceProvider, public sanitizer: DomSanitizer) {
      console.log('Hello HelperProvider Provider');
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
      this.firebase.onTokenRefresh()
        .subscribe((token: string) => {
          let data = {
            token: token
          }
          this.updateData(data);
          console.log(`Got a new token ${token}`);
        }, (error) => console.log("error in getting tokens", error));
    }
  
    updateData(data) {
      let headers = {
        'Content-Type': 'application/json'
      }
      this.storage.get("uuid").then((uuid) => {
          if(uuid){
            if(this.platform.is('ios')){
              data.platform = 'ios';
            } else if(this.platform.is('android')){
              data.platform = 'android';
            }
            data.key = uuid;
            this.alert(`${JSON.stringify(data)}`)
            this.authService.postData('user/device', headers, data)
            .then((res: any) => {
              console.log("Device data updated");
            }, (error) => {
              console.log("device update error",error);
              this.storage.set("firstTime", true);
            })
            .catch((e) => {
              console.log("device update catch",e);
              this.storage.set("firstTime", true);
            })
          }
      });    
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
  
    getBase64(img){                    
        var canvas = document.createElement("canvas");        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");        
        return dataURL;
    }
  
  
    diffDays(timestamp1, timestamp2) {
      var difference = timestamp1 - timestamp2;
      var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
      return daysDifference;
    }

    removeDuplicates(arr, posts, index){
      var oldPosts = []; //existing post available in localstorage
      var allPosts = []; 
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
      if(index == 1) {
        finalArr.push(...allPosts);
        finalArr.push(...oldPosts);
      } else {
        finalArr.push(...oldPosts);
        finalArr.push(...allPosts);
      }       
      return finalArr;       
    }
  
    mergeAndUpdateStorage(arr, pageHead){    
      var oldPosts = []; //existing post available in localstorage
      var allPosts = []; // new posts to download images    
      this.storage.get(pageHead).then((posts: any) => {            
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
        finalArr.push(...allPosts);      
        finalArr.push(...oldPosts);
        this.storage.set(pageHead, finalArr);           
      });
    }
  
    getPlatformHeight(posts){
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
      var result = posts.map(function(o) {        
        o.url = o.image,
        o.slideH = heights.slideH,
        o.imageH = heights.imageH,
        o.bodyH = heights.bodyH
        return o;
      })
      return result;
    }

    setOfflineDataReady(data: any){
      var localdata = []; 
      var arr = [];
      if(Object.keys(data).length > 0){
        if(data.post){
          arr = this.deepCopy(data.post);
          arr.forEach((element, index) => {                                            
            element.image = this.getBase64(document.getElementById(element._id));            
            localdata.push(element);
          });
          this.storage.get("pageHead")         
          .then((page) => {
            this.mergeAndUpdateStorage(localdata, page);
          })
        }
      }
    }

    deepCopy (arr) {
      var out = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        var obj = {};
        for (var k in item) {
          obj[k] = item[k];
        }
        out.push(obj);
      }
        return out;
    }

    insertToArray(arr, index, item){    
      arr.splice(index, 0, item);  
    }

    

    concatPostAndAd(posts, ads){  
      let position = 3;       // count of posts you need to see between each ad
      let iteration = Math.floor(posts.length / 3);      
      let adCount = [];
      let k = 0;
      for(let j=0; j<=iteration;j++){
        if(j !+ 0) k++;        
        let temp = ads[k];
        if(temp){
          adCount.push(temp);
        } else {
          k = 0;
          adCount.push(ads[k]);
        }
      }
      for(let i =1; i<=iteration;i++){         
        if(i != 1) {
          position = (3 * i) + (i-1);
        }
        if(posts.length >= position){          
          this.insertToArray(posts, position, adCount[i-1])          
        } else {
          this.insertToArray(posts, posts.length, adCount[i-1])
        }
      }
      return posts;
    }

    getShareURL(){
      let url;
      if(this.platform.is('ios')){
        url = `share/link/ios`;
      } else {
        url = `share/link/android`
      }       
      this.authService.getData(url) 
      .then((res: any) => {
        let temp;
        try {
          temp = JSON.parse(res._body);
        } catch (e) {
          console.log('already obj');
          temp = res._body;
        }    
        this.storage.set('share', temp.link);
      })
      .catch((err) => {
        this.storage.set('share', "");
      })
    }
    
}
