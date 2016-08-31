import {Component, ChangeDetectorRef} from "@angular/core";
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import listViewModule = require("nativescript-telerik-ui/listview");
import { ObservableArray } from "data/observable-array"

@Component({
  selector: "my-app",
  templateUrl: "app.component.html",
})

export class AppComponent {

  constructor(private http: Http, private changeDetectionRef: ChangeDetectorRef) { }
  private items = [];
  private layout: listViewModule.ListViewLinearLayout;
  private api_key = "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
  private tag = "lol";
  private tumblr_getTagged = "https://api.tumblr.com/v2/tagged";
  private before;
  private isBusy: boolean;
  private error: boolean;

  getData(before?: number): Observable<any[]> {
    var tumblrOptions = new URLSearchParams();
    tumblrOptions.set("api_key", this.api_key);
    tumblrOptions.set("tag", this.tag);
    if (typeof before !== 'undefined') {
      tumblrOptions.set("before", this.before);
    }

    return this.http.get(this.tumblr_getTagged, { search: tumblrOptions })
      .map(res => res.json())
      .map(data => <TumblrItem[]>data.response)
      .map(items => {
        return items
          .filter(item => item.photos && item.photos.length > 0)
          .map(item => {
            return {
              imageUrl: item.photos[0].alt_sizes[2].url,
              blogName: item.blog_name,
              timestamp: item.timestamp
            }
          })
      })
  }

  load(before?: number, args?: listViewModule.ListViewEventData) {
    this.getData(before).subscribe(data => {
      this.items = this.items.concat(data);
      this.before = data.slice(-1)[0].timestamp;
      this.error = false;
      if (typeof before === 'undefined') {
        this.changeDetectionRef.detectChanges();
      } else {
        var listView: listViewModule.RadListView = args.object;
        listView.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }
    },
    err => {
      console.log(err);
      this.error = true;
      this.before = this.before + 1;
      // this.load(this.before);
    });
  }

  public onLoadMoreItemsRequested(args: listViewModule.ListViewEventData) {
    this.load(this.before, args);
  }

  ngOnInit() {
    this.layout = new listViewModule.ListViewLinearLayout(); //Needs to be the first to initiate 
    this.layout.scrollDirection = "Vertical";
    this.layout.itemHeight = 400;
    this.load();
  }
}

interface TumblrItem {
  blog_name: string;
  photos: any;
  timestamp: number;
}