import { Component,OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newMessages=false;
  constructor(private webSocketService: WebsocketService){}
  unreadMessagesCount: number = 0;
  contentLoaded=false
  subscription!:Subscription;
  
  ngOnInit(): void {
    this.webSocketService.unreadMessagesBadge().subscribe({
      next:(data:any)=>{
        console.log(data)
        this.unreadMessagesCount = data.badge_number
        console.log(this.unreadMessagesCount)
        this.contentLoaded=true
      }
    })
    this.subscription=this.webSocketService.getMessages().subscribe({
      next:(data:any) => {
        console.log(data);
        if(data!=null){
          this.newMessages=true
          this.webSocketService.unreadMessagesBadge().subscribe({
            next:(data:any)=>{
              console.log(data)
              this.unreadMessagesCount = data.badge_number
              console.log(this.unreadMessagesCount)
            }
          })
        }
        // this.messages.push(data);
        
      },
      error:(error) => {
        console.log(error);
        if (error && error.error && typeof error.error !== 'object') {
          console.log(error.error);
        }
        
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
