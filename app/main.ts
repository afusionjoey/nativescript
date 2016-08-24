// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {HTTP_PROVIDERS} from "@angular/http";
import { LISTVIEW_PROVIDERS } from 'nativescript-telerik-ui/listview/angular';

nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS, LISTVIEW_PROVIDERS]);
