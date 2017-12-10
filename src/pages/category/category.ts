import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  public categoryName;
  public categoryId;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.categoryId = navParams.get("categoryId");
    this.categoryName = navParams.get("categoryName");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

}
