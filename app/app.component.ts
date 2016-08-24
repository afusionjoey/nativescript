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
  private resultItems
  private layout: listViewModule.ListViewLinearLayout;
  private api_key = "sk687FiqrYijZ3HNHT6Gm4kSYMgDguJpuvdS6tZW972GzBrnVg";
  private tag = "g-eazy";
  private tumblr_getTagged = "https://api.tumblr.com/v2/tagged";
  private isBusy: boolean;
  getInfo(before?: number): Observable<any[]> {
    var tumblrOptions = new URLSearchParams();
    tumblrOptions.set("api_key", this.api_key);
    tumblrOptions.set("tag", this.tag);
    tumblrOptions.set("before", '${before}')

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

  public onLoadMoreItemsRequested(args: listViewModule.ListViewEventData) {
    console.log('load more');
    this.isBusy = true;
    var listView: listViewModule.RadListView = args.object;
    this.getInfo(this.resultItems.slice(-1)[0].timestamp)
      .subscribe(items => {
        this.resultItems = this.resultItems.concat(items);
        listView.notifyLoadOnDemandFinished(); // API req - notify the event handler prolly 
        this.isBusy = false;
      })
    args.returnValue = true; // API req 
  }

  ngOnInit() {
    this.layout = new listViewModule.ListViewLinearLayout(); //Needs to be the first to initiate 
    this.layout.scrollDirection = "Vertical";
    this.layout.itemHeight = 400;

    this.getInfo()
      .subscribe(items => {
        this.resultItems = new ObservableArray(items);
        this.changeDetectionRef.detectChanges();
        // console.dump(this.resultItems);
        //console.dump(this.resultItems.slice(-1)[0].timestamp);
      });
  }
}

interface TumblrItem {
  blog_name: string;
  photos: any;
  timestamp: number;
}