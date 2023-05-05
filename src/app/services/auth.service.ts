import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedInUser } from "../interface/auth"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  SERVER_URL: string;
  constructor(private http: HttpClient) {
    this.SERVER_URL = environment.serverURL;
  }
  setLoggedInUser(userData: LoggedInUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
   }
   
  login(username:string,password:string): Observable<any> {
    return this.http.post(
      `${this.SERVER_URL}/api/login`, { username, password }
      ) as Observable<any>;
  }
  logout(){
    return this.http.get(
      `${this.SERVER_URL}/api/logout`);
  }
  changePassword(userId:string,data:any){
    return this.http.put(
      `${this.SERVER_URL}/api/change-password/${userId}`, data) ;
  }

  requestVerification(){
    return this.http.post(
      `${this.SERVER_URL}/api/request-verification`,{}) ;
  }
  
}
