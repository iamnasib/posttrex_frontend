import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserProfileService } from './user-profile/user-profile.service';

import { Location } from '@angular/common';
import { UserService } from './services/user.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  json:any;
  id:any;
  title = 'app_frontend';
  showNav=false
  showHeader=false
  showTopNav=false
  notification: any;
  notifications: any[]=[];
  constructor(private userService: UserService, private authService:AuthService, 
    private activatedRoute: ActivatedRoute,private router:Router, private location:Location,private webSocketService: WebsocketService,){
    
  }
  ngOnInit(): void {    
    if(localStorage.getItem('userData')){
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.id=obj.id
      
      }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("url",event.url)
        console.log(this.showNav)
        console.log("head",this.showHeader)
        this.showNav = this.activatedRoute.firstChild!.snapshot.data['showNav'] !== false;
        this.showHeader = this.activatedRoute.firstChild!.snapshot.data['showHeader'] !== false;
        this.showTopNav = this.activatedRoute.firstChild!.snapshot.data['showTopNav'] !== false;
        console.log("nav",this.showNav)
        console.log("head",this.showHeader)
        console.log("topnav",this.showTopNav)
        
      
      }
      
    });
    // this.webSocketService.emit('joinNotifications', {sender:this.id})
    //     this.webSocketService.recieveNotifications().subscribe({
    //       next:(data:any) => {
    //         console.log(data)
    //         this.notifications.push(data);
    //         if(data){
    //           this.notification = this.notifications.length;
    //         console.log(this.notification)
    //         }
            
    //       },
    //       error:(error) => {
    //         console.log(error);
    //         if (error && error.error && typeof error.error !== 'object') {
    //           console.log(error.error);
    //         }
            
    //       }
    //     })

    
  }

  backClick() {
    this.location.back();
  }

  isAuthenticated(){
    if(localStorage.getItem('userData')){
      return true
    }
    else{
      return false
    }
  }


}
