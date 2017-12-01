import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

let APIURL = "http://35.185.187.53:4000/api/v1/";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    
  }

  postData(url, headers, data){
    console.log("Gonna post url", APIURL + url)
    console.log("Gonna post data", JSON.stringify(data));
    console.log("Gonna post header", JSON.stringify(headers));    
    return new Promise((resolve, reject) => {
      this.http.post(APIURL + url, JSON.stringify(data), {headers})
      .subscribe((res) => {
        resolve(res);
      }, (error) => {
        reject(error);
      })
    })
  }

  getData(url){
    let headers = {
      'Content-Type' : 'application/json'      
    }  
    console.log("Gonna post url", APIURL + url)    
    console.log("Gonna post header", JSON.stringify(headers));   
    return new Promise((resolve, reject) => {
      this.http.get(APIURL + url)
      .subscribe((res) => {
        resolve(res);
      }, (error) => {
        reject(error);
      })
    })
  }

}
