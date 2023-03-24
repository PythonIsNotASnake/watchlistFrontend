import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DropboxLoginService {

    public saveLoginTimestamp() {
        var currentTimeInMinutes = Math.floor(Date.now()/1000/60);
        localStorage.setItem("dropbox_timestamp", currentTimeInMinutes.toString());
    }

    public saveAccessToken(accessToken: any) {
        localStorage.setItem("dropbox_access_token", accessToken.toString());
    }

    public getAccessToken(): string {
        var accessToken = localStorage.getItem("dropbox_access_token");
        if (!accessToken) {
            accessToken = "";
        }
        return accessToken;
    }

    public clearLogin() {
        this.clearAccessToken;
        this.clearLoginTimestamp;
    }

    public clearLoginTimestamp() {
        localStorage.removeItem("dropbox_timestamp");
    }

    public clearAccessToken() {
        localStorage.removeItem("dropbox_access_token");
    }

    public isLoggedIn(): boolean {
        var currentTimeInMinutes = Math.floor(Date.now()/1000/60);
        var timeOfLastLogin = localStorage.getItem("dropbox_timestamp");
        var accessToken = localStorage.getItem("dropbox_access_token");
        if (timeOfLastLogin === null || accessToken === null) {
            return false;
        }
        return parseInt(timeOfLastLogin) + 240 > currentTimeInMinutes;
    }

	constructor() {}

}
