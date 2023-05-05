import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment"
@Injectable({
  providedIn: 'root'
})
export class UserService {
  SERVER_URL: string;
  constructor(private http: HttpClient) {
    this.SERVER_URL = environment.serverURL;
  }

  getAllUsers(){
    return this.http.get(`${this.SERVER_URL}/users`);
  }

  getDetails(userId:any) {
    return this.http.get(`${this.SERVER_URL}/users/${userId}`);
  }

  geCurrentUserDetails(userId:any) {
    return this.http.get(`${this.SERVER_URL}/users/${userId}`);
  }

  getDetailsByUsername(username:any) {
    return this.http.get(`${this.SERVER_URL}/api/user/${username}`);
  }

  // updateUserDetails(userId:string,data:any) :Observable<any> {
  //   const 
  //     headers={
  //       'Content-Type': 'application/json'
  //     }

  //   return this.http.put(`${this.SERVER_URL}/users/${userId}/`, data);
  // }
  updateUserDetails(userId:string,data:any) :Observable<any> {
    const 
      headers={
        'Content-Type': 'application/json'
      }

    return this.http.put(`${this.SERVER_URL}/api/edit-user/${userId}`, data);
  }

  privateAccount(userId:string,data:any) :Observable<any>{
    return this.http.put(`${this.SERVER_URL}/api/private-account/${userId}`, data);
  }
  
  followToggle(userToFollow:any):Observable<any>{
    return this.http.post(`${this.SERVER_URL}/api/follow-toggle/${userToFollow}`,{});
  }

  removeFollower(userToRemove:any):Observable<any>{
    return this.http.post(`${this.SERVER_URL}/api/remove-follower/${userToRemove}`,{});
  }

  followUsersList(currentUserId:any):Observable<any>{
    return this.http.get(`${this.SERVER_URL}/api/follow-users-list/${currentUserId}`);
  } 
  
  followRequestsList(currentUserId:any):Observable<any>{
    return this.http.get(`${this.SERVER_URL}/api/follow-requests-list/${currentUserId}`);
  }

  acceptFollowRequest(UserId:any):Observable<any>{
    return this.http.put(`${this.SERVER_URL}/api/accept-follow-request/${UserId}`,{});
  }

  deleteFollowRequest(UserId:any):Observable<any>{
    return this.http.put(`${this.SERVER_URL}/api/delete-follow-request/${UserId}`,{});
  }

  blockedUsers(userId:any) :Observable<any>{
    return this.http.get(`${this.SERVER_URL}/api/blocked-users/${userId}`);
  }

  blockUser(userId:any,data:any) :Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(`${this.SERVER_URL}/api/block-user/${userId}`,data,{headers});
  }

  searchUsers(username:string) {
    return this.http.get(`${this.SERVER_URL}/api/search/?username=${username}`);
  }

  sendFeedback(data:any):Observable<any>{
    return this.http.post(`${this.SERVER_URL}/api/send-feedback`,data);
  }
}


















// addRecord(userId:string,full_name:string,username:string,email:string,intro:string,
  //   website: string,mobile_number: string,avatar: File): Observable<any>{
  //   let formData: any = new FormData();
  //   formData.append("full_name", full_name)
  //   formData.append("username", username)
  //   formData.append("email", email)
  //   formData.append("intro", intro)
  //   formData.append("website", website)
  //   formData.append("mobile_number", mobile_number)
  //   formData.append("avatar", avatar)
  //   return this.http.put(`${this.SERVER_URL}/users/${userId}/`, formData);
  // }
// this.id,this.form.value.full_name
//       this.form.value.username,this.form.value.email,this.form.value.intro,this.form.value.website,
//       this.form.value.mobile_number,this.form.value.avatar,