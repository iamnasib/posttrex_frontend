import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { DatePipe, Location } from '@angular/common'
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  prevNotifications:any
  notifications:any
  json:any
  currentUserID:any
  followRequestsLength:any
  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private webSocketService: WebsocketService,
    private location: Location,private notificationsService: NotificationsService, private datePipe: DatePipe){}

  ngOnInit(): void {
    this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      console.log("obj.id:",obj.id)
      this.currentUserID = obj.id
      console.log("json:",this.currentUserID)
    this.notificationsService.getNotifications().subscribe({
      next:(data:any) => {
        console.log(data)
        this.notifications=data
        if(this.notifications.length>0){
          this.notificationsService.MarkNotificationsAsRead().subscribe()
        }
      }
    })
    
    this.userService.followRequestsList(this.currentUserID).subscribe({
      next:(data) => {
        console.log(data)
        const { requested_to, requested_by } = data;
        console.log("requested_to array",requested_to)
        console.log("requested_by array",requested_by)
        this.followRequestsLength = requested_by.length
        
      }
    });
    // this.webSocketService.recieveNotifications().subscribe({
    //   next:(data:any) => {
    //     console.log(data)
    //     this.notifications.push(data);
    //   }
    // })
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
