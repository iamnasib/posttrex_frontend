import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: any;
  readonly uri: string = "https://efficient-aboard-spectroscope.glitch.me" ; //"http://localhost:3000"
  SERVER_URL: string;
  
  constructor(
      private http: HttpClient
      ) {        
      this.SERVER_URL=environment.serverURL
      this.socket = io.connect(`${this.uri}`);
  }

  public listen(eventName: string) {
      return new Observable((subscriber) => {
          this.socket.on(eventName, (data:any) => {
              subscriber.next(data);
          })
      });
  }

  storeMessagedb(newchatdetails:any) {
      
      return this.http.post<any>(`${this.SERVER_URL}/chat/createchat/`, newchatdetails).subscribe();
  }

  getPrevMessages(recieverId:any): Observable<any> {
      console.log(recieverId)
      return this.http.get(`${this.SERVER_URL}/api/chat/${recieverId}`);
  }
  unreadMessagesBadge(): Observable<any>{
    return this.http.get(`${this.SERVER_URL}/api/unread-messages-badge`);
  }
  getRecentMessages(): Observable<any> {
    return this.http.get(`${this.SERVER_URL}/api/recent-chat`);
}

deleteMessages(receiverid:any):Observable<any> {
    return this.http.post(`${this.SERVER_URL}/api/delete-chat`,receiverid);
}

MarkMessagesAsRead(user_id:any){
  const data = JSON.stringify({ user_id });
  return this.http.post(`${this.SERVER_URL}/api/mark-messages-as-read`,data);
}
  
  public getMessages() {
    return new Observable((observer:any) => {
      this.socket.on('new-message', function (data:any) {
          observer.next(data);
          console.log(data)
      });
  });
  }
  public recieveNotifications(){
    return new Observable((observer:any) => {
        this.socket.on('recieveNotifications',  function (data:any) {
            // this.notifications.push(request);
            // this.notification = this.notifications.length;
            observer.next(data);
            console.log(data)
          })
          
    });
  }

  storeNotificationdb(notificationDetails:any){
    return this.http.post<any>(`${this.SERVER_URL}/api/notifications`, notificationDetails).subscribe();
  }

  deleteNotification(notificationDetails:any){
    console.log(notificationDetails)
    return this.http.post<any>(`${this.SERVER_URL}/api/notifications/del`, notificationDetails);
  }

  public emit(eventName: string, data: any) {
    console.log(eventName)
      this.socket.emit(eventName, data);

  }
}
