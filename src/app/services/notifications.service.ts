import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private socket: any;
  readonly uri: string =  "http://localhost:3000";
  SERVER_URL: string;
  
  constructor(
      private http: HttpClient
      ) {        
      this.SERVER_URL=environment.serverURL
  }

  getNotifications(){
    return this.http.get(`${this.SERVER_URL}/api/notifications`);
  }

  getUnreadNotificationsLength(){
    return this.http.get(`${this.SERVER_URL}/api/unread-notifications-length`);
  }
  MarkNotificationsAsRead(){
    return this.http.post(`${this.SERVER_URL}/api/mark-notifications-asread`,{});
  }
}
