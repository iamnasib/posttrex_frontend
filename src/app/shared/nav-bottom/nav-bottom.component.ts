import { Component,OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-nav-bottom',
  templateUrl: './nav-bottom.component.html',
  styleUrls: ['./nav-bottom.component.css']
})
export class NavBottomComponent implements OnInit{
  currentUser:any;
  current='active';
  json:any;
  id:any
  notifications:any[]=[]
  notification:any
  newMessages: boolean =false;
  subscription!: Subscription;
  constructor(private router: Router,private webSocketService: WebsocketService,private notificationsService: NotificationsService){
    this.current=window.location.pathname
  }
  ngOnInit(){
    if(localStorage.getItem('userData')){
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.id=obj.id
      this.currentUser=obj.username
      }
      console.log(this.notification)
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.current=window.location.pathname
          const icon = document.getElementById('notification-icon');
          const path = document.getElementById('stroke');
          if (this.current === '/notifications') {
            icon!.setAttribute('fill', '#06b6d4'); // set the fill color to cyan if on the notifications page
            path!.setAttribute('stroke', '#06b6d4'); 
            this.notification=0
      this.notifications=[]
        } else {
            icon!.setAttribute('fill', 'none'); // set the stroke color to gray for other pages
            path!.setAttribute('stroke', '#6b7280'); 
        }
        
        }
        
        
      });

      this.webSocketService.unreadMessagesBadge().subscribe({
        next:(data:any)=>{
          console.log(data.badge_number)
          if(data.badge_number>0){
            this.newMessages = true
            
          }
          
        }
      })

      this.subscription= this.webSocketService.getMessages().subscribe({
        next:(data:any) => {
          console.log(data);
          if(data!=null){
            this.newMessages=true 
            
          }
        },
        error:(error) => {
          console.log(error);
          if (error && error.error && typeof error.error !== 'object') {
            console.log(error.error);
          }
        }
      });

      this.notificationsService.getUnreadNotificationsLength().subscribe({
        next:(data:any)=>{
          console.log(data)
          this.notification=data.length
        }
      })
      this.webSocketService.emit('joinNotifications', {sender:this.id})
      this.webSocketService.recieveNotifications().subscribe({
          next:(data) => {
            console.log(data)
            this.notifications=[]
            this.notifications.push(data);
            console.log(this.notifications.length)
            if(data){
              this.notification += this.notifications.length;
            console.log(this.notification)
            }
            
          },
          error:(error) => {
            console.log(error);
            if (error && error.error && typeof error.error !== 'object') {
              console.log(error.error);
            }
            
          }
        })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reloadPage(option:any){
    if(option=='home'){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['home']);
      });
    }
    else if(option=='search'){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['search']);
      });
    }
    else if(option=='notifications'){
      this.notification=0
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['notifications']);

      });
    }
    else if(option=='profile'){
      this.ngOnInit()
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUser]);
      });
    }
  
  }
}
