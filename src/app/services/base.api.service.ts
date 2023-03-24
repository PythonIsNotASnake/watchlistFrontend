import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import axios from "axios";
import { AppConfigService } from "../app.config.service";

@Injectable({
    providedIn: "root"
})
export class BaseApiService {

	constructor(private config: AppConfigService) {}

}
