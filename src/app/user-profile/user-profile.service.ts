import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  SERVER_URL: string;
  constructor(private http: HttpClient) {
    this.SERVER_URL = environment.serverURL;
  }

  getUserProfile(userId: string|null): Observable<any> {
    return this.http.get(`${this.SERVER_URL}/users/${userId}`);
  }
}
