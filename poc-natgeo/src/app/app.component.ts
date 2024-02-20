import { Component } from '@angular/core';
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'poc-natgeo';

  env: string = "prod";
  url = `https://learn.eltngl.com/lti/v1/launch`;
  key = `dcfab8be8d6c1f8d55580fce1ccc29`;
  secret = `abbab91ee6c02bb43ae9a4090a31e6edcbaa4c8e`;
  isbn = '9780357783801';

  queryString:string = "";
  queryString2:string = "";
  queryString3:string = "";
  oauthSignature:string = "";
  status:string = "";
  data:string = "";

  constructor(private service: AppService) {
  }

  getQueryString(){
    this.service.getQueryString(this.env).subscribe((strings:any) => {
      console.log("strings", strings)
      this.queryString = strings.queryString;
      this.queryString2 = strings.queryString2;
      this.queryString3 = strings.queryString3;
      this.oauthSignature = strings.oauth_signature;
      this.status = strings.status || "";
      this.data = strings.data || "";
    })
  }

  setEnvironment(env:string){

    this.env = env;
    if(env == "prod") {
      this.url = `https://learn.eltngl.com/lti/v1/launch`;
      this.key = `dcfab8be8d6c1f8d55580fce1ccc29`;
      this.secret = `abbab91ee6c02bb43ae9a4090a31e6edcbaa4c8e`;
      this.isbn = '9780357783795';
    } else {
      this.url = `https://learn.eltngl.com/lti/v1/test`;
      this.key = `f34de744c349d39c8d5feb3fcba551`;
      this.secret = `f9d5a1497c3f8ea5da20b7d590c27a3e96a487d1`;
      this.isbn = '9780357784624';
    }

  }

}
