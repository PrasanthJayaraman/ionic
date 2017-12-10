webpackJsonp([3],{

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CategoryPage = (function () {
    function CategoryPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.categoryId = navParams.get("categoryId");
        this.categoryName = navParams.get("categoryName");
    }
    CategoryPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CategoryPage');
    };
    return CategoryPage;
}());
CategoryPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-category',template:/*ion-inline-start:"/Users/apple/Documents/Ionic/ionic/src/pages/category/category.html"*/'<ion-header>\n  <ion-navbar hideBackButton="true">\n    <ion-buttons left>\n      <button ion-button menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-title>\n      {{categoryName}}\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n<h3>{{categoryId}}</h3>\n</ion-content>\n'/*ion-inline-end:"/Users/apple/Documents/Ionic/ionic/src/pages/category/category.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
], CategoryPage);

//# sourceMappingURL=category.js.map

/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ProfilePage = (function () {
    function ProfilePage(authService, loadingCtrl, alertCtrl, storage, formBuilder, navCtrl, navParams) {
        var _this = this;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        storage.set('page', 'Profile');
        this.storage.get("profile")
            .then(function (profile) {
            if (profile) {
                _this.user = _this.formBuilder.group({
                    name: [profile.name || '', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
                    email: [profile.email || '', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
                    phone: [profile.phone || '', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
                    gender: [profile.gender || '', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]
                });
            }
            else {
                _this.user = _this.formBuilder.group({
                    name: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
                    email: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
                    phone: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
                    gender: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]
                });
            }
        });
    }
    ProfilePage.prototype.alert = function (title, content) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: content,
            buttons: ['Ok']
        });
        alert.present();
    };
    ProfilePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProfilePage');
    };
    ProfilePage.prototype.updateUserData = function (form) {
        var data = this.user.value;
        if (data.name == "") {
            return this.alert("Alert", "Please enter your name");
        }
        else if (data.name && data.name.length < 3) {
            return this.alert("Alert", "Please enter a valid name");
        }
        if (!data.email) {
            return this.alert("Alert", "Please enter your email");
        }
        else if (data.email && !this.validateEmail(data.email)) {
            return this.alert("Alert", "Please enter valid email");
        }
        if (!data.phone) {
            return this.alert("Alert", "Please enter your phone number");
        }
        else if (data.phone.length < 10 || data.phone.length > 10 || !this.validatePhone(data.phone)) {
            return this.alert("Alert", "Please enter valid phone number");
        }
        if (!data.gender) {
            return this.alert("Alert", "Please select your gender");
        }
        else if (data.gender != "male" && data.gender != "female") {
            return this.alert("Alert", "Please select your gender");
        }
        this.postLoginData('user', data);
    };
    ProfilePage.prototype.changeStatus = function (gender) {
        console.log("gender", gender);
    };
    ProfilePage.prototype.postLoginData = function (url, data) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Loading, please wait...'
        });
        loading.present();
        var headers = {
            'Content-Type': 'application/json'
        };
        var body = {
            user: data
        };
        this.authService.postData(url, headers, body)
            .then(function (res) {
            if (res.status && res.status == 200) {
                var data_1 = JSON.parse(res._body);
                _this.storage.set('profile', data_1).then(function () {
                    _this.storage.set('isLoggedIn', true).then(function () {
                        loading.dismiss();
                        _this.alert("Success", "Successfully saved your profile");
                        _this.navCtrl.pop();
                    }, function (error) { return console.error("islogg error", error); });
                }, function (error) { return console.error("pro error", error); });
            }
            else {
                loading.dismiss();
                _this.alert("Error", res.data.message);
            }
        }, function (err) {
            loading.dismiss();
            _this.alert("Error", err.data.message);
        });
    };
    ProfilePage.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    ProfilePage.prototype.validatePhone = function (phone) {
        var regex = /^\d+$/;
        return regex.test(phone);
    };
    return ProfilePage;
}());
ProfilePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-profile',template:/*ion-inline-start:"/Users/apple/Documents/Ionic/ionic/src/pages/profile/profile.html"*/'<ion-header>\n    <ion-navbar hideBackButton="true">\n      <ion-buttons left>\n        <button ion-button menuToggle>\n          <ion-icon name="menu"></ion-icon>\n        </button>\n      </ion-buttons>\n      <ion-title>\n        My Profile\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n  \n\n<ion-content padding>\n    <form *ngIf="user" [formGroup]="user" (ngSubmit)="updateUserData()">\n      <ion-item class="inputPadding">\n        <ion-label fixed>Name</ion-label>\n        <ion-input type="text" formControlName="name"></ion-input>\n      </ion-item>\n      <ion-item class="inputPadding">\n        <ion-label fixed>Email</ion-label>\n        <ion-input type="email" formControlName="email"></ion-input>\n      </ion-item>\n      <ion-item class="inputPadding">\n        <ion-label fixed>Phone</ion-label>\n        <ion-input type="tel" formControlName="phone"></ion-input>\n      </ion-item>\n      <br><br>\n      <ion-list radio-group formControlName="gender">\n        <ion-list-header>Gender</ion-list-header>\n        <ion-item>\n          <ion-label>Male</ion-label>\n          <ion-radio (click)="changeStatus(\'male\')" value="male"></ion-radio>\n        </ion-item>\n      \n        <ion-item>\n          <ion-label>Female</ion-label>\n          <ion-radio (click)="changeStatus(\'female\')" value="female"></ion-radio>    \n        </ion-item>                 \n      </ion-list>\n      <br>\n      <button ion-button color="secondary" type="submit" class="shadow bottom-space" round style="width:99%" >Save Profile</button>\n    </form>\n</ion-content>\n'/*ion-inline-end:"/Users/apple/Documents/Ionic/ionic/src/pages/profile/profile.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
], ProfilePage);

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular_platform_platform__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_auth_service_auth_service__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var WelcomePage = (function () {
    function WelcomePage(viewCtrl, storage, formBuilder, navCtrl, navParams, alertCtrl, platform, fb, googlePlus, authService, loadingCtrl) {
        this.viewCtrl = viewCtrl;
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.fb = fb;
        this.googlePlus = googlePlus;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        storage.set('page', 'Welcome');
        this.user = this.formBuilder.group({
            name: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            email: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            phone: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
        });
    }
    WelcomePage.prototype.alert = function (title, content) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: content,
            buttons: ['Ok']
        });
        alert.present();
    };
    WelcomePage.prototype.login = function (form) {
        var data = this.user.value;
        if (data.name == "") {
            return this.alert("Alert", "Please enter your name");
        }
        else if (data.name && data.name.length < 3) {
            return this.alert("Alert", "Please enter a valid name");
        }
        if (!data.email) {
            return this.alert("Alert", "Please enter your email");
        }
        else if (data.email && !this.validateEmail(data.email)) {
            return this.alert("Alert", "Please enter valid email");
        }
        if (!data.phone) {
            return this.alert("Alert", "Please enter your phone number");
        }
        else if (data.phone.length < 10 || data.phone.length > 10 || !this.validatePhone(data.phone)) {
            return this.alert("Alert", "Please enter valid phone number");
        }
        this.postLoginData('user', data);
    };
    WelcomePage.prototype.postLoginData = function (url, data) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Loading, please wait...'
        });
        loading.present();
        var headers = {
            'Content-Type': 'application/json'
        };
        var body = {
            user: data
        };
        this.storage.get("uuid").then(function (uuid) {
            if (uuid) {
                body.user.key = uuid;
                _this.authService.postData(url, headers, body)
                    .then(function (res) {
                    if (res.status && res.status == 200) {
                        var data_1 = JSON.parse(res._body);
                        _this.storage.set('profile', data_1).then(function () {
                            _this.storage.set('isLoggedIn', true).then(function () {
                                loading.dismiss();
                                _this.alert("Info", JSON.stringify(data_1));
                                _this.viewCtrl.dismiss();
                            }, function (error) { return console.error("islogg error", error); });
                        }, function (error) { return console.error("pro error", error); });
                    }
                    else {
                        loading.dismiss();
                        _this.alert("Error", res.data.message);
                    }
                }, function (err) {
                    loading.dismiss();
                    _this.alert("Error", err.data.message);
                });
            }
            else {
                _this.authService.postData(url, headers, body)
                    .then(function (res) {
                    if (res.status && res.status == 200) {
                        var data_2 = JSON.parse(res._body);
                        _this.storage.set('profile', data_2).then(function () {
                            _this.storage.set('isLoggedIn', true).then(function () {
                                loading.dismiss();
                                _this.alert("Info", JSON.stringify(data_2));
                                _this.viewCtrl.dismiss();
                            }, function (error) { return console.error("islogg error", error); });
                        }, function (error) { return console.error("pro error", error); });
                    }
                    else {
                        loading.dismiss();
                        _this.alert("Error", res.data.message);
                    }
                }, function (err) {
                    loading.dismiss();
                    _this.alert("Error", err.data.message);
                });
            }
        });
    };
    WelcomePage.prototype.cancel = function () {
        this.viewCtrl.dismiss();
    };
    WelcomePage.prototype.loginFB = function () {
        var _this = this;
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then(function (res) {
            if (res.status == "connected") {
                _this.getUserDetailFB(res.authResponse.userID);
            }
            else {
                _this.alert("Alert", "You FB security is blocking, Please enter your details to get started!");
            }
        })
            .catch(function (e) { return console.log('Error logging into Facebook', e); });
    };
    WelcomePage.prototype.loginGoogle = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Fetching your facebook profile...'
        });
        this.googlePlus.login({}).then(function (userData) {
            loading.dismiss();
            var detail = {
                name: userData.displayName,
                email: userData.email
            };
            _this.postLoginData('user/social', detail);
        }).catch(function (err) { return console.error(err); });
    };
    WelcomePage.prototype.getUserDetailFB = function (userid) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Fetching your facebook profile...'
        });
        loading.present();
        this.fb.api("/" + userid + "/?fields=id,email,name,gender", ["public_profile"])
            .then(function (res) {
            loading.dismiss();
            var detail = {
                name: res.name,
                gender: res.gender,
                email: res.email
            };
            _this.postLoginData('user/social', detail);
        })
            .catch(function (e) {
            console.log(e);
        });
    };
    WelcomePage.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    WelcomePage.prototype.validatePhone = function (phone) {
        var regex = /^\d+$/;
        return regex.test(phone);
    };
    return WelcomePage;
}());
WelcomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-welcome',template:/*ion-inline-start:"/Users/apple/Documents/Ionic/ionic/src/pages/welcome/welcome.html"*/'<!--\n  Generated template for the WelcomePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n\n<ion-content center text-center padding>\n  <br>\n  <br>\n  <button (click)="cancel()" style="right: 0;position: absolute;margin-right: 12px;font-size:20px;">\n    <ion-icon name="close"></ion-icon>\n  </button>\n  <img src="assets/imgs/icon.png" class="logo-medium" alt="logo" >\n  <h5 class="secondary bold">Please sign in to explore more jobs..</h5>\n  <div>\n    <!-- <span class="light">-- Sign in with --</span> -->\n    <br>\n    <br>\n    <div class="button-wrapper">\n      <button ion-button class="whitey-background circle shadow" (click)="loginFB()" style="margin-right:30px;">\n        <img src="assets/imgs/facebook.png" class="logo-small" alt="fb">\n      </button>\n      <br>\n      <button ion-button class="whitey-background circle shadow" (click)="loginGoogle()">\n        <img src="assets/imgs/google.png" class="logo-small" alt="g+">\n      </button>\n    </div>\n    <br>\n    <span class="light">-- Or --</span>\n    <form [formGroup]="user" (ngSubmit)="login()">\n      <ion-item class="inputPadding">\n        <ion-label fixed>Name</ion-label>\n        <ion-input type="text" formControlName="name"></ion-input>\n      </ion-item>\n      <ion-item class="inputPadding">\n        <ion-label fixed>Email</ion-label>\n        <ion-input type="email" formControlName="email"></ion-input>\n      </ion-item>\n      <ion-item class="inputPadding">\n        <ion-label fixed>Phone</ion-label>\n        <ion-input type="tel" formControlName="phone"></ion-input>\n      </ion-item>\n      <br>\n      <button ion-button color="secondary" type="submit" class="shadow bottom-space" round style="width:95%" >Get Started</button>\n    </form>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/apple/Documents/Ionic/ionic/src/pages/welcome/welcome.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6_ionic_angular_platform_platform__["a" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__["a" /* Facebook */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__["a" /* GooglePlus */], __WEBPACK_IMPORTED_MODULE_7__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
], WelcomePage);

//# sourceMappingURL=welcome.js.map

/***/ }),

/***/ 115:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 115;

/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/category/category.module": [
		284,
		2
	],
	"../pages/profile/profile.module": [
		285,
		1
	],
	"../pages/welcome/welcome.module": [
		286,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 157;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Home; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_location_accuracy__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_diagnostic__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_firebase__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_auth_service_auth_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_network__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_in_app_browser__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_unique_device_id__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_platform_browser__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__welcome_welcome__ = __webpack_require__(106);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var Home = (function () {
    function Home(uniqueDeviceID, toast, network, modalCtrl, navCtrl, storage, platform, geolocation, locationAccuracy, diagnostic, alertCtrl, firebase, authService, inAppBrowser, sanitizer) {
        var _this = this;
        this.uniqueDeviceID = uniqueDeviceID;
        this.toast = toast;
        this.network = network;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.platform = platform;
        this.geolocation = geolocation;
        this.locationAccuracy = locationAccuracy;
        this.diagnostic = diagnostic;
        this.alertCtrl = alertCtrl;
        this.firebase = firebase;
        this.authService = authService;
        this.inAppBrowser = inAppBrowser;
        this.sanitizer = sanitizer;
        this.timestamp = new Date().getTime();
        this.heights = {};
        storage.set('page', 'Home');
        platform.ready().then(function () {
            if (platform.is('cordova')) {
                _this.disconnectSubscription = network.onDisconnect().subscribe(function () {
                    if (_this.current) {
                        _this.current = false;
                        _this.isOnline = false;
                    }
                });
                _this.connectSubscription = network.onConnect().subscribe(function () {
                    if (!_this.current) {
                        _this.current = true;
                        setTimeout(function () {
                            _this.getData(1);
                        }, 3000);
                    }
                });
                firebase.onNotificationOpen()
                    .subscribe(function (notification) {
                    if (notification.tap) {
                        _this.alert(notification.body);
                    }
                    else {
                        _this.alert(notification.body);
                    }
                });
                _this.disconnectSubscription = _this.network.onDisconnect().subscribe(function () {
                    _this.toast.create({
                        message: "No network connection!",
                        duration: 3000
                    }).present();
                });
            }
        });
        platform.registerBackButtonAction(function (e) {
            storage.get('page').then(function (page) {
                var alert = alertCtrl.create({
                    title: 'Confirm',
                    message: 'Do you want to exit?',
                    buttons: [{
                            text: "exit?",
                            handler: function () { _this.exitApp(); }
                        }, {
                            text: "Cancel",
                            role: 'cancel'
                        }]
                });
                alert.present();
            });
        });
    }
    Home.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.getData(1);
        this.getPlatformHeight();
        this.platform.ready().then(function () {
            if (_this.platform.is('cordova')) {
                _this.getPlatformHeight();
                _this.type = _this.network.type;
                _this.storage.set('page', 'Home');
                if (_this.type == "unknown" || _this.type == "none" || _this.type == undefined) {
                    _this.isOnline = false;
                    _this.current = false;
                }
                else {
                    _this.isOnline = true;
                    _this.current = true;
                }
                console.log("online", _this.isOnline);
                if (_this.isOnline) {
                    _this.getData(1); // download data
                }
                else {
                    //show local data when no internet
                    _this.storage.get('posts').then(function (posts) {
                        _this.posts = posts;
                    }, function (error) { return console.error("pro error", error); });
                }
                _this.storage.get('isLoggedIn').then(function (val) {
                    if (!val) {
                        setTimeout(function () {
                            var modal = _this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_12__welcome_welcome__["a" /* WelcomePage */]);
                            modal.present();
                        }, 40 * 1000);
                    }
                });
                _this.storage.get("firstTime").then(function (first) {
                    _this.storage.get("limit").then(function (limit) {
                        if (!first) {
                            _this.storage.set("firstTime", true);
                            _this.storage.set("limit", _this.timestamp);
                            _this.getDeviceId();
                            _this.registerPush();
                            _this.getLocation();
                        }
                        else if (limit) {
                            var now = new Date().getTime();
                            var diff = _this.diffDays(now, limit);
                            if (diff > 0) {
                                _this.alert("Updating device location and token");
                                _this.registerPush();
                                _this.getLocation();
                                _this.storage.set("limit", now);
                            }
                        }
                    });
                });
            }
        });
    };
    Home.prototype.exitApp = function () {
        this.platform.exitApp();
    };
    Home.prototype.alert = function (content) {
        var alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: content,
            buttons: ['Dismiss']
        });
        alert.present();
    };
    Home.prototype.getLocation = function () {
        var _this = this;
        this.locationAccuracy.canRequest().then(function (canRequest) {
            if (canRequest) {
                _this.locationAccuracy.request(_this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(function () {
                    _this.fetchLocation();
                }, function (error) {
                    console.log(error);
                    _this.alert("Cannot read request your location " + error);
                });
            }
            else {
                _this.fetchLocation();
            }
        });
    };
    Home.prototype.fetchLocation = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition(options).then(function (resp) {
            console.log(resp.coords.latitude, resp.coords.longitude);
            var data = {
                location: [resp.coords.latitude, resp.coords.longitude]
            };
            _this.updateData(data);
        }).catch(function (error) {
            console.log('Error getting location', error);
            _this.alert("Cannot read your location " + error);
        });
    };
    Home.prototype.registerPush = function () {
        var _this = this;
        this.firebase.hasPermission()
            .then(function (data) {
            if (data.isEnabled) {
                _this.collectToken();
            }
            else {
                _this.firebase.grantPermission()
                    .then(function (permission) {
                    _this.collectToken();
                }, function (error) { return console.log("error in getting permission", error); });
            }
        }, function (error) { return console.log("Error in checking push permission"); });
    };
    Home.prototype.getDeviceId = function () {
        var _this = this;
        this.uniqueDeviceID.get()
            .then(function (uuid) {
            console.log("Device Id", uuid);
            _this.storage.set("uuid", uuid);
        })
            .catch(function (error) {
            console.log(error);
            _this.storage.set("uuid", "");
        });
    };
    Home.prototype.collectToken = function () {
        var _this = this;
        this.firebase.onTokenRefresh()
            .subscribe(function (token) {
            var data = {
                token: token
            };
            _this.updateData(data);
            console.log("Got a new token " + token);
        }, function (error) { return console.log("error in getting tokens", error); });
    };
    Home.prototype.diffDays = function (timestamp1, timestamp2) {
        var difference = timestamp1 - timestamp2;
        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        return daysDifference;
    };
    Home.prototype.getData = function (index) {
        var _this = this;
        if (!index) {
            index = 1;
        }
        this.posts = [];
        this.authService.getData('posts/' + index)
            .then(function (res) {
            _this.index = index;
            var temp;
            try {
                temp = JSON.parse(res._body);
            }
            catch (e) {
                console.log('already obj');
                temp = res._body;
            }
            _this.posts = temp.post;
            var localPosts = [];
            setTimeout(function () {
                temp.post.forEach(function (element) {
                    element.image = _this.getBase64(document.getElementById(element._id));
                    localPosts.push(element);
                });
                _this.updateStorage(localPosts);
            }, 3000);
        });
    };
    Home.prototype.getPlatformHeight = function () {
        this.platformHeight = this.platform.height();
        if (this.platform.is('ios')) {
            if (this.platformHeight == 812) {
                this.platformHeight -= 70; //iphone X
            }
            else {
                this.platformHeight -= 44;
            }
        }
        this.heights.slideH = this.platformHeight + "px";
        this.heights.imageH = Number(((30 / 100) * this.platformHeight).toFixed(1)) + "px";
        this.heights.bodyH = Number(((68 / 100) * this.platformHeight).toFixed(1)) + "px";
    };
    Home.prototype.updateData = function (data) {
        var _this = this;
        var headers = {
            'Content-Type': 'application/json'
        };
        this.storage.get("uuid").then(function (uuid) {
            if (uuid) {
                data.key = uuid;
                _this.alert("" + JSON.stringify(data));
                _this.authService.postData('user/device', headers, data)
                    .then(function (res) {
                    console.log("Device data updated");
                }, function (error) {
                    console.log("device update error", error);
                    _this.storage.set("firstTime", false);
                })
                    .catch(function (e) {
                    console.log("device update catch", e);
                    _this.storage.set("firstTime", false);
                });
            }
        });
    };
    Home.prototype.openWithSystemBrowser = function (url) {
        var options = {
            clearCache: 'no'
        };
        this.inAppBrowser.create(url, '_blank', options);
    };
    Home.prototype.getBase64 = function (img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        return this.sanitizer.bypassSecurityTrustUrl(dataURL);
    };
    Home.prototype.updateStorage = function (arr) {
        var _this = this;
        var oldPosts = []; //existing post available in localstorage
        var allPosts = []; // new posts to download images
        console.log("incoming", arr.length);
        this.storage.get('posts').then(function (posts) {
            console.log("posts length", posts && posts.length);
            if (posts && posts.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    var newPosts = [];
                    var existing = false;
                    for (var j = 0; j < posts.length; j++) {
                        if (arr[i] && posts[j]) {
                            if (arr[i]._id == posts[j]._id) {
                                oldPosts.push(posts[j]);
                                existing = true;
                                break;
                            }
                        }
                    }
                    if (!existing && arr[i]) {
                        newPosts.push(arr[i]);
                    }
                    allPosts.push.apply(allPosts, newPosts);
                }
            }
            else {
                allPosts = arr.slice(); // if localstorage is empty save current posts
            }
            console.log("oldPosts", oldPosts.length);
            console.log("allPosts", allPosts.length);
            var finalArr = [];
            finalArr.push.apply(finalArr, oldPosts);
            finalArr.push.apply(finalArr, allPosts);
            console.log("finalArr lrngth", finalArr.length);
            _this.storage.set('posts', finalArr);
            _this.storage.get('posts').then(function (posts) {
                //console.log("final", JSON.stringify(posts));
            });
        });
    };
    return Home;
}());
Home = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"/Users/apple/Documents/Ionic/ionic/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar hideBackButton="true">\n    <ion-buttons left>\n      <button ion-button menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-title>\n      Jobswala\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>    \n   <ion-slides direction=\'vertical\' sensitivity="2" effect="slide" loop="false">                             \n    <ion-slide class="bg-white" *ngFor="let post of posts" [style.height]="heights.slideH">                       \n      <div class="post-image-div" [style.height]="heights.imageH">\n        <img [attr.id]="post._id" [src]="post.image" class="post-image" alt="No image" crossOrigin="Anonymous" />          \n      </div>      \n      <div class="post-content-div" [style.height]="heights.bodyH">\n        <p class="title-text">{{post.title.length > 50 ? post.title.substring(0, 50) + "..." : post.title }}</p>\n        <p class="body-text" [innerHtml]="post.body"></p>\n        <div class="row buttons-row">\n          <div class="column">            \n            <button ion-button color="secondary" (click)="openWithSystemBrowser(post.applyUrl)" outline>Apply</button>\n          </div>\n          <div class="column">            \n              <button ion-button color="secondary" (click)="openWithSystemBrowser(post.notifyUrl)" class="button" outline>Notify</button>\n          </div>\n          <div class="column">            \n              <button ion-button color="secondary" class="button" outline>Share</button>\n          </div>\n        </div>\n      </div>\n    </ion-slide>\n  </ion-slides>\n <!-- Patte Loper is a painter who experiments with sculpture and video. She was born in Colorado and grew up in Tallahassee,\n          FL, a subtropical college town where she first developed an appreciation for the ways nature and culture can overlap.\n          She currently lives and works in Brooklyn, NY, and Boston, MA, where she is on the faculty of the School of the\n          Museum of Fine Arts, Boston, MA. She has shown her work in numerous solo and group exhibitions internationally,\n          including the Drawing Center, New York, NY; \n          \n      -->\n</ion-content>'/*ion-inline-end:"/Users/apple/Documents/Ionic/ionic/src/pages/home/home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_10__ionic_native_unique_device_id__["a" /* UniqueDeviceID */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_7__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_9__ionic_native_in_app_browser__["a" /* InAppBrowser */], __WEBPACK_IMPORTED_MODULE_11__angular_platform_browser__["c" /* DomSanitizer */]])
], Home);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(228);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_location_accuracy__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_diagnostic__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_firebase__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_storage__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_facebook__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_google_plus__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_auth_service_auth_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_http__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_network__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_file_transfer__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_file__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_in_app_browser__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_unique_device_id__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_home_home__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_welcome_welcome__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_profile_profile__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_category_category__ = __webpack_require__(104);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
























var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_20__pages_home_home__["a" /* Home */],
            __WEBPACK_IMPORTED_MODULE_21__pages_welcome_welcome__["a" /* WelcomePage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_23__pages_category_category__["a" /* CategoryPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_14__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                links: [
                    { loadChildren: '../pages/category/category.module#CategoryPageModule', name: 'CategoryPage', segment: 'category', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/profile/profile.module#ProfilePageModule', name: 'ProfilePage', segment: 'profile', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/welcome/welcome.module#WelcomePageModule', name: 'WelcomePage', segment: 'welcome', priority: 'low', defaultHistory: [] }
                ]
            }),
            __WEBPACK_IMPORTED_MODULE_10__ionic_storage__["a" /* IonicStorageModule */].forRoot({
                name: '__jobswala',
                driverOrder: ['indexeddb', 'sqlite', 'websql']
            })
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_20__pages_home_home__["a" /* Home */],
            __WEBPACK_IMPORTED_MODULE_21__pages_welcome_welcome__["a" /* WelcomePage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_23__pages_category_category__["a" /* CategoryPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_diagnostic__["a" /* Diagnostic */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_firebase__["a" /* Firebase */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_storage__["a" /* IonicStorageModule */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_facebook__["a" /* Facebook */],
            __WEBPACK_IMPORTED_MODULE_15__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_google_plus__["a" /* GooglePlus */],
            __WEBPACK_IMPORTED_MODULE_18__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_13__providers_auth_service_auth_service__["a" /* AuthServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_16__ionic_native_file_transfer__["a" /* FileTransfer */],
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_19__ionic_native_unique_device_id__["a" /* UniqueDeviceID */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_facebook__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_auth_service_auth_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_category_category__ = __webpack_require__(104);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MyApp = (function () {
    function MyApp(authService, storage, platform, statusBar, splashScreen, fb) {
        var _this = this;
        this.authService = authService;
        this.storage = storage;
        this.platform = platform;
        this.fb = fb;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* Home */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            _this.getCategories();
        });
    }
    MyApp.prototype.getCategories = function () {
        var _this = this;
        this.storage.get("categories")
            .then(function (cats) {
            _this.categories = cats || [];
            _this.authService.getData("categories")
                .then(function (categories) {
                var temp;
                try {
                    temp = JSON.parse(categories._body);
                }
                catch (e) {
                    temp = categories._body;
                }
                _this.categories = temp;
                _this.storage.set("categories", temp);
            });
        });
    };
    MyApp.prototype.openCategory = function (category) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_9__pages_category_category__["a" /* CategoryPage */], {
            categoryId: category._id,
            categoryName: category.name
        });
    };
    MyApp.prototype.openHome = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* Home */]);
    };
    MyApp.prototype.openProfile = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__["a" /* ProfilePage */]);
    };
    MyApp.prototype.logout = function () {
        this.fb.logout()
            .then(function (res) { return console.log("FB logged out"); })
            .catch(function (e) { return console.log('Error logout from Facebook', e); });
        this.storage.clear();
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/apple/Documents/Ionic/ionic/src/app/app.html"*/'<ion-menu side="left" [content]="content" [swipeEnabled]="false" persistent="true"> \n    <ion-header>\n        <ion-toolbar>\n            <ion-title>Home</ion-title>\n        </ion-toolbar>\n    </ion-header>\n    <ion-content>\n        <ion-list>\n            <button ion-item menuClose (click)="openHome()">\n                Home\n            </button>  \n            <button ion-item menuClose (click)="openProfile()">\n                My Profile\n            </button>    \n            <button ion-item menuClose *ngFor="let cat of categories" (click)="openCategory(cat)">\n                {{cat.name}}\n            </button>         \n            <button ion-item menuClose (click)="logout()">\n                Logout\n            </button>\n        </ion-list>\n    </ion-content>\n</ion-menu>\n\n<ion-nav id="nav" #content [root]="rootPage" hideBackButton="true" swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/Users/apple/Documents/Ionic/ionic/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_facebook__["a" /* Facebook */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var APIURL = "http://35.185.187.53:4000/api/v1/";
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var AuthServiceProvider = (function () {
    function AuthServiceProvider(http) {
        this.http = http;
    }
    AuthServiceProvider.prototype.postData = function (url, headers, data) {
        var _this = this;
        console.log("Gonna post url", APIURL + url);
        console.log("Gonna post data", JSON.stringify(data));
        console.log("Gonna post header", JSON.stringify(headers));
        return new Promise(function (resolve, reject) {
            _this.http.post(APIURL + url, JSON.stringify(data), { headers: headers })
                .subscribe(function (res) {
                resolve(res);
            }, function (error) {
                reject(error);
            });
        });
    };
    AuthServiceProvider.prototype.getData = function (url) {
        var _this = this;
        var headers = {
            'Content-Type': 'application/json'
        };
        console.log("Gonna post url", APIURL + url);
        console.log("Gonna post header", JSON.stringify(headers));
        return new Promise(function (resolve, reject) {
            _this.http.get(APIURL + url)
                .subscribe(function (res) {
                resolve(res);
            }, function (error) {
                reject(error);
            });
        });
    };
    return AuthServiceProvider;
}());
AuthServiceProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], AuthServiceProvider);

//# sourceMappingURL=auth-service.js.map

/***/ })

},[210]);
//# sourceMappingURL=main.js.map