import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  SERVER_URL: string;
  constructor(private http: HttpClient) {
    this.SERVER_URL = environment.serverURL;
  }
  register(user:any) {
    return this.http.post(`${this.SERVER_URL}/api/register`, user);
}
}
