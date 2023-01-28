import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
  public baseApi: string = "";
  public dropboxUrl: string = "";
  public dropboxClientId: string = "";
  public mastodonUrl: string = "";
  public mastodonClientId: string = "";
  public mastodonRedirectUri: string = "";

	constructor(private http: HttpClient) {}

		load() :Promise<any>  {

      const promise = this.http.get('/assets/app.config.json')
        .toPromise()
        .then(data => {
          Object.assign(this, data);
          return data;
        });

      return promise;
  }
}
