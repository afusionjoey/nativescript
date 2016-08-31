"use strict";
var core_1 = require("@angular/core");
var http_1 = require('@angular/http');
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
var listViewModule = require("nativescript-telerik-ui/listview");
var AppComponent = (function () {
    function AppComponent(http, changeDetectionRef) {
        this.http = http;
        this.changeDetectionRef = changeDetectionRef;
        this.items = [];
        this.api_key = "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
        this.tag = "lol";
        this.tumblr_getTagged = "https://api.tumblr.com/v2/tagged";
    }
    AppComponent.prototype.getData = function (before) {
        var tumblrOptions = new http_1.URLSearchParams();
        tumblrOptions.set("api_key", this.api_key);
        tumblrOptions.set("tag", this.tag);
        if (typeof before !== 'undefined') {
            tumblrOptions.set("before", this.before);
        }
        return this.http.get(this.tumblr_getTagged, { search: tumblrOptions })
            .map(function (res) { return res.json(); })
            .map(function (data) { return data.response; })
            .map(function (items) {
            return items
                .filter(function (item) { return item.photos && item.photos.length > 0; })
                .map(function (item) {
                return {
                    imageUrl: item.photos[0].alt_sizes[2].url,
                    blogName: item.blog_name,
                    timestamp: item.timestamp
                };
            });
        });
    };
    AppComponent.prototype.load = function (before, args) {
        var _this = this;
        this.getData(before).subscribe(function (data) {
            _this.items = _this.items.concat(data);
            _this.before = data.slice(-1)[0].timestamp;
            _this.error = false;
            if (typeof before === 'undefined') {
                _this.changeDetectionRef.detectChanges();
            }
            else {
                var listView = args.object;
                listView.notifyLoadOnDemandFinished();
                args.returnValue = true;
            }
        }, function (err) {
            console.log(err);
            _this.error = true;
            _this.before = _this.before + 1;
            // this.load(this.before);
        });
    };
    AppComponent.prototype.onLoadMoreItemsRequested = function (args) {
        this.load(this.before, args);
    };
    AppComponent.prototype.ngOnInit = function () {
        this.layout = new listViewModule.ListViewLinearLayout(); //Needs to be the first to initiate 
        this.layout.scrollDirection = "Vertical";
        this.layout.itemHeight = 400;
        this.load();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            templateUrl: "app.component.html",
        }), 
        __metadata('design:paramtypes', [http_1.Http, core_1.ChangeDetectorRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map