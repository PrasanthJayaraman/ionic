import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  public categoryName;
  public categoryId;
  public categoryPosts;
  public index;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController,
    public authService: AuthServiceProvider, public storage: Storage, public sanitizer: DomSanitizer) {
    this.categoryId = navParams.get("categoryId");
    this.categoryName = navParams.get("categoryName");

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

  getData(index) {
    if (!index) { 
      index = 1;
    }
    this.categoryPosts = [];
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
        this.categoryPosts = temp.post;
        var localPosts = [];
        setTimeout(() => {
          temp.post.forEach(element => {                               
            element.image = this.getBase64(document.getElementById(element._id));
            localPosts.push(element);
          });
          this.updateStorage(localPosts);
        }, 3000)                
      })
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

  exitApp() {
    this.platform.exitApp();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
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
