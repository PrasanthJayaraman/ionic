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
        setTimeout(() => {
          this.updateData(data);
        }, 3000);
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
          setTimeout(() => {
            this.updateData(data);
          }, 3000);
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
            //this.alert(`${JSON.stringify(data)}`)
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
  
    diffDays(timestamp1, timestamp2) {
      var difference = timestamp1 - timestamp2;
      var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
      return daysDifference;
    }    
  
    getPlatformHeight(posts, totalHeight){
      if(totalHeight && totalHeight != "0"){
        this.platformHeight = totalHeight;
      } else {
        this.platformHeight = this.platform.height();
        if (this.platform.is('ios')) {
          if (this.platformHeight == 812) {
            this.platformHeight -= 70; 
          } else {
            this.platformHeight -= 44;
          }
        } else if(this.platform.is('android')){
          this.platformHeight -= 56;
        }
      }      
      var heights = <any>Object;
      heights.slideH = `${this.platformHeight}px`;
      heights.imageH = `${Number(((30 / 100) * this.platformHeight).toFixed(1))}px`;
      heights.bodyH = `${Number(((61 / 100) * this.platformHeight).toFixed(1))}px`;
      heights.footerH = `${Number(((7 / 100) * this.platformHeight).toFixed(1))}px`;
      console.log("heights", heights.slideH, heights.imageH, heights.bodyH, heights.footerH);
      var result = posts.map(function(o) {        
        o.url = o.image,
        o.slideH = heights.slideH,
        o.imageH = heights.imageH,
        o.bodyH = heights.bodyH
        return o;
      })
      return result;
    }

    getBase64(img){                    
      try{        
        var canvas = document.createElement("canvas");        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");        
        return this.sanitizer.bypassSecurityTrustUrl(dataURL);
      } catch (e){
        console.log(e);
        return "";
      }        
    }

    setOfflineDataReady(data: any){
      var localdata = []; 
      var arr = [];
      if(Object.keys(data).length > 0){
        if(data){
          arr = data;          
          this.asyncLoop(arr.length, (loop) => {
            let each = arr[loop.iteration()];
            //each.image = this.getBase64(document.getElementById(each._id));            
            this.convertToDataURLviaCanvas(each.url, "image/png")
            .then( base64Img => {
               each.image = base64Img;
               localdata.push(each);
               loop.next();
            }, (err) => {
              console.log(err);
              each.image = "assets/imgs/placeholder.png"
              loop.next();
            })            
          }, () => {
            console.log("converted all images to base64");
            this.storage.get("pageHead")         
            .then((page) => {
              this.storage.set(page, localdata);  
              //this.mergeAndUpdateStorage(localdata, page);
            })
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
      for(let item of posts){                
        item.newImage = `<img data-url="online" src="${item.url}" class="post-image ${item._id}" alt="No image" />`
      }
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
    
    asyncLoop(iterations, func, callback) {
      var index = 0;
      var done = false;
      var loop = {
          next: () => {
              if (done) {
                  return;
              }
  
              if (index < iterations) {
                  index++;
                  func(loop);
  
              } else {
                  done = true;
                  callback();
              }
          },
  
          iteration: () => {
              return index - 1;
          },
  
          break: () => {
              done = true;
              callback();
          }
      };
      loop.next();
      return loop;
  }

  convertToDataURLviaCanvas(url, outputFormat){
    return new Promise( (resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
        var self : any = this;
        let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
        canvas.height = self.height;
        canvas.width = self.width;
        ctx.drawImage(self, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        //callback(dataURL);
        canvas = null;
        resolve(dataURL); 
      };
      img.src = url;
    });
  }
    
}
