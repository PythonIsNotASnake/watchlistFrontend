import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DropboxLoginService {

    public saveLoginTimestamp() {
        var currentTimeInMinutes = Math.floor(Date.now()/1000/60);
        localStorage.setItem("dropbox_timestamp", currentTimeInMinutes.toString());
    }

    public clearLoginTimestamp() {
        localStorage.removeItem("dropbox_timestamp");
    }

    public isLoggedIn(): boolean {
        var currentTimeInMinutes = Math.floor(Date.now()/1000/60);
        var timeOfLastLogin = localStorage.getItem("dropbox_timestamp");
        if (timeOfLastLogin === null) {
            return false;
        }
        return parseInt(timeOfLastLogin) + 240 > currentTimeInMinutes;
    }

	constructor() {}

}
