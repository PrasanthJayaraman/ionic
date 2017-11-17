webpackJsonp([1],{

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__home_home__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular_platform_platform__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var WelcomePage = (function () {
    function WelcomePage(storage, formBuilder, navCtrl, navParams, alertCtrl, platform, fb) {
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.fb = fb;
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
            buttons: ['Okay']
        });
        alert.present();
    };
    WelcomePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad WelcomePage');
    };
    WelcomePage.prototype.login = function (form) {
        var _this = this;
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
            return this.alert("Alert", "Please enter a valid email");
        }
        if (!data.phone) {
            return this.alert("Alert", "Please enter your phone number");
        }
        else if (data.phone.length < 10 || data.phone.length > 10 || !this.validatePhone(data.phone)) {
            return this.alert("Alert", "Please enter a valid phone number");
        }
        this.storage.set('profile', data).then(function () {
            _this.storage.set('isLoggedIn', true).then(function () {
                _this.storage.get('isLoggedIn').then(function (isLoggedIn) {
                    console.log("isLoggedIn", isLoggedIn);
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__home_home__["a" /* Home */]);
                }, function (error) { return console.error("fetch", error); });
            }, function (error) { return console.error("islogg error", error); });
        }, function (error) { return console.error("pro error", error); });
    };
    WelcomePage.prototype.loginFB = function () {
        var _this = this;
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then(function (res) {
            console.log('Logged into Facebook!', res);
            if (res.status == "connected") {
                _this.getUserDetailFB(res.authResponse.userID);
            }
            else {
                _this.alert("Alert", "You FB security is blocking, Please enter your details to get started!");
            }
        })
            .catch(function (e) { return console.log('Error logging into Facebook', e); });
    };
    WelcomePage.prototype.getUserDetailFB = function (userid) {
        var _this = this;
        this.fb.api("/" + userid + "/?fields=id,email,name,gender", ["public_profile"])
            .then(function (res) {
            console.log(res);
            var detail = {
                name: res.name,
                gender: res.gender,
                email: res.email
            };
            _this.alert("Login", detail.name + " " + detail.email + " " + detail.gender);
            _this.storage.set('profile', detail);
            _this.storage.set('isLoggedIn', true);
            _this.alert("alert", _this.storage.get("isLoggedIn"));
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__home_home__["a" /* Home */]);
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
        selector: 'page-welcome',template:/*ion-inline-start:"D:\jobswala-ios\src\pages\welcome\welcome.html"*/'<!--\n\n  Generated template for the WelcomePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n\n\n<ion-content center text-center padding>\n\n  <img src="assets/imgs/lion.png" class="logo-medium" alt="logo">\n\n  <h3 class="primary bold">Welcome to Jobs Wala</h3>\n\n  <div>\n\n    <span class="light">-- Sign in with --</span>\n\n    <br>\n\n    <br>\n\n    <div class="button-wrapper">\n\n      <button ion-button class="whitey-background circle shadow" (click)="loginFB()" style="margin-right:30px;">\n\n        <img src="assets/imgs/facebook.png" class="logo-small" alt="fb">\n\n      </button>\n\n      <br>\n\n      <button ion-button class="whitey-background circle shadow">\n\n        <img src="assets/imgs/google.png" class="logo-small" alt="g+">\n\n      </button>\n\n    </div>\n\n    <br>\n\n    <span class="light">-- Or --</span>\n\n    <form [formGroup]="user" (ngSubmit)="login()">\n\n      <ion-item class="secondary-background inputPadding">\n\n        <ion-label fixed>Name</ion-label>\n\n        <ion-input type="text" formControlName="name"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="secondary-background inputPadding">\n\n        <ion-label fixed>Email</ion-label>\n\n        <ion-input type="email" formControlName="email"></ion-input>\n\n      </ion-item>\n\n      <ion-item class="secondary-background inputPadding">\n\n        <ion-label fixed>Phone</ion-label>\n\n        <ion-input type="number" formControlName="phone"></ion-input>\n\n      </ion-item>\n\n      <br>\n\n      <button ion-button color="primary" type="submit" class="shadow bottom-space" round full>Get Started</button>\n\n    </form>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\jobswala-ios\src\pages\welcome\welcome.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6_ionic_angular_platform_platform__["a" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__["a" /* Facebook */]])
], WelcomePage);

//# sourceMappingURL=welcome.js.map

/***/ }),

/***/ 112:
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
webpackEmptyAsyncContext.id = 112;

/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/welcome/welcome.module": [
		272,
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
webpackAsyncContext.id = 153;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(219);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_welcome_welcome__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_geolocation__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_location_accuracy__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_diagnostic__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_firebase__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_storage__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_facebook__ = __webpack_require__(80);
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
            __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* Home */],
            __WEBPACK_IMPORTED_MODULE_5__pages_welcome_welcome__["a" /* WelcomePage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                links: [
                    { loadChildren: '../pages/welcome/welcome.module#WelcomePageModule', name: 'WelcomePage', segment: 'welcome', priority: 'low', defaultHistory: [] }
                ]
            }),
            __WEBPACK_IMPORTED_MODULE_12__ionic_storage__["a" /* IonicStorageModule */].forRoot({
                name: '__jobswala',
                driverOrder: ['indexeddb', 'sqlite', 'websql']
            })
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* Home */],
            __WEBPACK_IMPORTED_MODULE_5__pages_welcome_welcome__["a" /* WelcomePage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_diagnostic__["a" /* Diagnostic */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_firebase__["a" /* Firebase */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_storage__["a" /* IonicStorageModule */],
            __WEBPACK_IMPORTED_MODULE_13__ionic_native_facebook__["a" /* Facebook */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_facebook__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_welcome_welcome__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(82);
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
    function MyApp(storage, platform, statusBar, splashScreen, fb) {
        var _this = this;
        this.storage = storage;
        this.platform = platform;
        this.fb = fb;
        storage.get('isLoggedIn').then(function (val) {
            //storage.remove('isLoggedIn');
            if (val) {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* Home */];
            }
            else {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_6__pages_welcome_welcome__["a" /* WelcomePage */];
            }
        });
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp.prototype.openHome = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* Home */]);
    };
    MyApp.prototype.logout = function () {
        var _this = this;
        this.fb.logout()
            .then(function (res) { return console.log("FB logged out"); })
            .catch(function (e) { return console.log('Error logout from Facebook', e); });
        this.storage.clear();
        this.storage.set('page', "Welcome");
        setTimeout(function () {
            _this.nav.push(__WEBPACK_IMPORTED_MODULE_6__pages_welcome_welcome__["a" /* WelcomePage */]);
        }, 100);
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"D:\jobswala-ios\src\app\app.html"*/'<ion-menu side="left" [content]="content" [swipeEnabled]="false"> \n\n    <ion-header>\n\n        <ion-toolbar>\n\n            <ion-title>Home</ion-title>\n\n        </ion-toolbar>\n\n    </ion-header>\n\n    <ion-content>\n\n        <ion-list>\n\n            <button ion-item menuClose (click)="openHome(\'Home\')">\n\n                Home\n\n            </button>            \n\n            <button ion-item menuClose (click)="logout()">\n\n                Logout\n\n            </button>\n\n        </ion-list>\n\n    </ion-content>\n\n</ion-menu>\n\n\n\n<ion-nav id="nav" #content [root]="rootPage"  swipeBackEnabled="false"></ion-nav>\n\n'/*ion-inline-end:"D:\jobswala-ios\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_facebook__["a" /* Facebook */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Home; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_location_accuracy__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_diagnostic__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_firebase__ = __webpack_require__(158);
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
    function Home(navCtrl, storage, platform, geolocation, locationAccuracy, diagnostic, alertCtrl, firebase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.platform = platform;
        this.geolocation = geolocation;
        this.locationAccuracy = locationAccuracy;
        this.diagnostic = diagnostic;
        this.alertCtrl = alertCtrl;
        this.firebase = firebase;
        storage.set('page', 'Home');
        platform.ready().then(function () {
            if (platform.is('cordova')) {
                _this.registerPush();
                storage.get("location").then(function (location) {
                    if (location) {
                        console.log("Location alerady available", location);
                    }
                    else {
                        _this.getLocation();
                    }
                }, function (error) { return console.error("Location fetch error", error); });
                firebase.onNotificationOpen()
                    .subscribe(function (notification) {
                    console.log("Got", notification);
                    if (notification.tap) {
                        _this.alert(notification.tap);
                    }
                    else {
                        _this.alert(notification.tap);
                    }
                });
            }
        });
        platform.registerBackButtonAction(function (e) {
            storage.get('page').then(function (page) {
                if (page == "Home") {
                    var alert_1 = alertCtrl.create({
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
                    alert_1.present();
                }
                else if (page == "Welcome") {
                    _this.exitApp();
                }
            });
        });
    }
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
            _this.location = {
                "latitude": resp.coords.latitude,
                "longitude": resp.coords.longitude
            };
            _this.alert(_this.location.latitude + " " + _this.location.longitude);
            _this.storage.set("location", _this.location).then(function () {
                console.log("Location set succesfully");
            }, function (error) { return console.log("error reading loc", error); });
        }).catch(function (error) {
            console.log('Error getting location', error);
            _this.storage.set("location", "");
            _this.alert("Cannot read your location " + error);
        });
    };
    Home.prototype.registerPush = function () {
        var _this = this;
        console.log("register push called");
        this.firebase.hasPermission()
            .then(function (data) {
            if (data.isEnabled) {
                _this.collectToken();
            }
            else {
                console.log("Push not permitted");
                _this.firebase.grantPermission()
                    .then(function (permission) {
                    console.log("asked for permission", permission);
                    _this.collectToken();
                }, function (error) { return console.log("error in getting permission", error); });
            }
        }, function (error) { return console.log("Error in checking push permission"); });
    };
    Home.prototype.collectToken = function () {
        var _this = this;
        console.log("collect called");
        this.firebase.onTokenRefresh()
            .subscribe(function (token) {
            debugger;
            console.log("Got a new token " + token);
            _this.storage.set("token", token);
        }, function (error) { return console.log("error in getting tokens", error); });
    };
    return Home;
}());
Home = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"D:\jobswala-ios\src\pages\home\home.html"*/' <ion-header>\n\n  <ion-navbar>\n\n    <ion-buttons left>\n\n      <button ion-button menuToggle>\n\n        <ion-icon name="menu"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n    <ion-title>\n\n      Home\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <h2>Welcome to Ionic!</h2>\n\n  <p>Its COOL B-)</p>    \n\n</ion-content>\n\n'/*ion-inline-end:"D:\jobswala-ios\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_location_accuracy__["a" /* LocationAccuracy */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_firebase__["a" /* Firebase */]])
], Home);

//# sourceMappingURL=home.js.map

/***/ })

},[200]);
//# sourceMappingURL=main.js.map