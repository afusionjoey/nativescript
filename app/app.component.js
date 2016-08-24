"use strict";
var core_1 = require("@angular/core");
var http_1 = require('@angular/http');
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
var listViewModule = require("nativescript-telerik-ui/listview");
var observable_array_1 = require("data/observable-array");
var AppComponent = (function () {
    function AppComponent(http, changeDetectionRef) {
        this.http = http;
        this.changeDetectionRef = changeDetectionRef;
        this.api_key = "sk687FiqrYijZ3HNHT6Gm4kSYMgDguJpuvdS6tZW972GzBrnVg";
        this.tag = "g-eazy";
        this.tumblr_getTagged = "https://api.tumblr.com/v2/tagged";
    }
    AppComponent.prototype.getInfo = function (before) {
        var tumblrOptions = new http_1.URLSearchParams();
        tumblrOptions.set("api_key", this.api_key);
        tumblrOptions.set("tag", this.tag);
        tumblrOptions.set("before", '${before}');
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
    AppComponent.prototype.onLoadMoreItemsRequested = function (args) {
        var _this = this;
        console.log('load more');
        this.isBusy = true;
        var listView = args.object;
        this.getInfo(this.resultItems.slice(-1)[0].timestamp)
            .subscribe(function (items) {
            _this.resultItems = _this.resultItems.concat(items);
            listView.notifyLoadOnDemandFinished(); // API req - notify the event handler prolly 
            _this.isBusy = false;
        });
        args.returnValue = true; // API req 
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.layout = new listViewModule.ListViewLinearLayout(); //Needs to be the first to initiate 
        this.layout.scrollDirection = "Vertical";
        this.layout.itemHeight = 400;
        this.getInfo()
            .subscribe(function (items) {
            _this.resultItems = new observable_array_1.ObservableArray(items);
            _this.changeDetectionRef.detectChanges();
            // console.dump(this.resultItems);
            //console.dump(this.resultItems.slice(-1)[0].timestamp);
        });
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