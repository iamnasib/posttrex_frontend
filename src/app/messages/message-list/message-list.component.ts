import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common'
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  recentChats:any
  newMessages = false;
  contentLoaded=false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private webSocketService: WebsocketService,
    private location: Location,
    private datePipe: DatePipe
  ){}
  
  json:any
  currentUsername:any

  ngOnInit(): void {
    this.newMessages = false;
    if(localStorage.getItem('userData')){
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.currentUsername=obj.username
      // this.currentUserId=obj.id
      console.log("currentUserId",this.currentUsername)
      }
      
    this.webSocketService.getRecentMessages().subscribe({
      next :(data) => {
        console.log(data)
        this.recentChats=data.recent_chats
        this.contentLoaded=true
        },
      error:(error)=>{
        console.log("error")
        console.log(error);
      }
    })
    this.webSocketService.getMessages().subscribe({
      next:(data:any) => {
        console.log(data);
        if(data!=null){
          this.newMessages=true
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
  formatTimeDiff(dateStr: string): string {
    if (!dateStr) {
      return '';
    }
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    if (diffSecs < 60) {
      return `${diffSecs} secs ago`;
    } else if (diffSecs < 60 * 60) {
      const diffMins = Math.floor(diffSecs / 60);
      if(diffMins<2){
        return `${diffMins} min ago`;
      }
      else{
        return `${diffMins} mins ago`;
      }
      
    } else if (diffSecs < 60 * 60 * 24) {
      const diffHours = Math.floor(diffSecs / (60 * 60));
      if(diffHours<2){
        return `${diffHours} hr ago`;
      }
      else{
        return `${diffHours} hrs ago`;
      }
      
    } else {
      const formattedDate = this.datePipe.transform(dateStr, 'dd MMM yy');
      return formattedDate ?? '';
    }
  }
}
