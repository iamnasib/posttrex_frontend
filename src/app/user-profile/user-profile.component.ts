import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router, NavigationEnd, NavigationStart } from "@angular/router";
import { UserProfileService } from "./user-profile.service";
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Location, DatePipe } from '@angular/common';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loading=false;
  serverError=null;
  userProfile:any;
  userId:any;
  showOptionsElement=false;
  json:any;
  currentUser:any;
  currentUserId:any
  username:any;
  isBlocked=true;
  isBlockedBy=false;
  following=false;
  requested=false
  obj:any
  notification;
  contentLoaded=false
  constructor(private userService: UserService, private authService:AuthService, 
    private activatedRoute: ActivatedRoute, private router:Router, private location: Location
    ,private datePipe:DatePipe,private webSocketService: WebsocketService ) { 
      this.notification = {
        notification_sender: null,
        notification_receiver: null,
        verb: "",
        category:"",
    }
    //   this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.ngOnInit()
    //   }
    // });
  }
  
  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    
    console.log("detailby username",this.username);
    if(localStorage.getItem('userData')){
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.currentUser=obj.username
      this.currentUserId=obj.id
      console.log("currentUserId",this.currentUserId)
      }
    this.userService.getDetailsByUsername(this.username).subscribe({
      next:(data) => {
        console.log(data);
        this.userProfile=data;
        this.userId=this.userProfile.id
        console.log("userProfile.id",this.userProfile.id)
        console.log("followers",this.userProfile.followers.length)
        this.userService.blockedUsers(this.userId).subscribe({
          next:(data) => {
            console.log(data);
            
            const { blocked_user, blocked_by } = data;
            console.log("blocked_user array",blocked_user)
            console.log("blocked_by array",blocked_by)
            if(blocked_user.length>0){
            for (let i = 0; i < blocked_user.length; i++) {
              console.log("blocked_user[i]",blocked_user[i],this.currentUserId);

              if(blocked_user[i].id==this.currentUserId){
                this.isBlocked=true //redirect or display not found page
                console.log("isblocked",this.isBlocked)
                break;
              }
              else{
                this.isBlocked=false //redirect or display not found page
                console.log("isblocked",this.isBlocked)
                break;
              }
            }
          }
          else{
            this.isBlocked=false //redirect or display not found page
                console.log("isblocked",this.isBlocked)
          }
          console.log("isblocked",this.isBlocked)
            
            if(blocked_by.length>0){
              for (let i = 0; i < blocked_by.length; i++) {
                console.log("blocked_by[i]",blocked_by[i]);
                if(blocked_by[i].id==this.currentUserId){
                  this.isBlockedBy=true 
                  console.log("isblockedby",this.isBlockedBy)
                  break;
                }
                else{
                  this.isBlockedBy=false //redirect or display not found page
                  console.log("isblockedby",this.isBlockedBy)
                  break;
                }
            }
            }
            else{
              this.isBlockedBy=false //redirect or display not found page
                  console.log("isblockedby",this.isBlockedBy)
            }
            
            console.log("isblockedby",this.isBlockedBy)
          },
          error:(error)=>{
            console.log(error);
          }
        });

        //following list:
        this.userService.followUsersList(this.currentUserId).subscribe({
          next:(data) =>{
            console.log(data);
              
              const { following, followers } = data;
              console.log("following array",following)
              console.log("followers array",followers)
              
                for (let i = 0; i < following.length; i++) {
                  console.log("blocked_user[i]",following[i].id,this.currentUserId);
    
                  if(following[i].id==this.userId){
                    this.following=true //redirect or display not found page
                    console.log("following",this.following)
                    break;
                  }
                }
              
          },
          error:(error)=>{
            console.log(error);
          }
        });

        //request list
        this.userService.followRequestsList(this.currentUserId).subscribe({
          next:(data) =>{
            console.log(data);
              
              const { requested_to, requested_by } = data;
              console.log("requested_to array",requested_to)
              console.log("requested_by array",requested_by)
              
                for (let i = 0; i < requested_to.length; i++) {
                  console.log("requested_to[i]",requested_to[i],this.currentUserId);
    
                  if(requested_to[i].id==this.userId){
                    this.requested=true //redirect or display not found page
                    console.log("requested_to",this.requested)
                    break;
                  }
                }
                this.contentLoaded=true
              
          },
          error:(error)=>{
            console.log(error);
          }
        });

      },
      error:(error)=>{
        console.log('NOT FOUND',error);//not found page
      }
      
    });
    
    
  }

  backClick() {
    this.location.back();
  }

  showOptions(){
    if(this.showOptionsElement==false){
      this.showOptionsElement=true
    }
    else{
      this.showOptionsElement=false
    }
  }
  isOwner(){
    if(this.currentUser==this.username){
      return true
    }
    else{
      return false
    }
  }

  followToggle(){
    this.loading=true
    this.userService.followToggle(this.userId).subscribe({
      next:(data) =>{
        console.log(data)
        
        if(data.toggle==true){

          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: this.userId,
            verb: "started following you.",
            category:"follow",
        }

          this.webSocketService.emit('sendNotifications', {
            notification_receiver: this.userId,
            verb: `${this.currentUser,this.currentUserId} started following you.${this.userId}`
            })
            this.webSocketService.storeNotificationdb(this.notification);
          console.log(data.toggle)
          this.following=true
          this.loading=false
        }
        else if(data.toggle=='requested'){

          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: this.userId,
            verb: "requested to follow you.",
            category:"request",
        }

          console.log(data.toggle)
          this.requested=true
          this.webSocketService.emit('sendNotifications', {
            notification_receiver: this.userId,
            verb: `${this.currentUser,this.currentUserId}has requested to follow you.${this.userId}`,
            });
            this.webSocketService.storeNotificationdb(this.notification);
        }
        else if(data.toggle=='deleted'){
          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: this.userId,
            verb: "requested to follow you.",
            category:"request",
        }
        console.log(this.currentUserId)
        this.webSocketService.deleteNotification(this.notification).subscribe({
          next:(data)=>{
            console.log(data)
          },
          error:(error)=>{
            console.log(error)
          }
        });;
        console.log(this.currentUserId)
          this.requested=false
        }
        else{
          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: this.userId,
            verb: "started following you.",
            category:"follow",
        }
          console.log(data.toggle)
          this.following=false
          this.webSocketService.deleteNotification(this.notification).subscribe({
            next:(data)=>{
              console.log(data)
            },
            error:(error)=>{
              console.log(error)
            }
          });;
          
        }
        this.loading=false
      }
    })
    this.userService.getDetailsByUsername(this.username).subscribe({
      next:(data) => {
        console.log(data);
        this.userProfile=data;
        console.log(this.userProfile.following.length)
        console.log(this.userProfile.followers.length)
      }
    });
  }

  blockUser(){
    const data =  { 'blocked_user': this.userId, 'blocked_by': this.currentUserId }
    
    this.userService.blockUser(this.currentUserId,data).subscribe({
      next:(data) =>{
        console.log(data)
        this.following=false
        this.requested=false
        
      }
    });
    this.isBlocked=false;
    this.isBlockedBy=false;
    this.ngOnInit()
  }

  Logout() {
    localStorage.removeItem('userData');
    this.authService.logout().subscribe({
      next:()=>{
        this.router.navigateByUrl(`/login`)
      },
      error:(error) => {
        if (error && error.error && typeof error.error !== 'object') {
          this.serverError = error.error;
          this.loading = false;
        }
      }
    })
    this.router.navigateByUrl(`/login`)
  }
}
