import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SearchUser } from '../interface/search-user';
import { WebsocketService } from '../services/websocket.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-following-followers',
  templateUrl: './following-followers.component.html',
  styleUrls: ['./following-followers.component.css']
})
export class FollowingFollowersComponent implements OnInit {

  json:any;
  currentUserId:any;
  followersList:SearchUser[]=[];
  followingList:SearchUser[]=[];
  itemsToShow=15;
  selectedTab=''
  notification;
  following:any;
  requested:any;
  userId:any
  username: any;

  constructor(private userService: UserService,private webSocketService: WebsocketService,
    private router:Router,private activatedRoute: ActivatedRoute,private location:Location){

    this.notification = {
      notification_sender: null,
      notification_receiver: null,
      verb: "",
      category:"",
  }
  }
  backClick() {
    this.location.back();
  }

  ngOnInit(): void {
    const type = this.activatedRoute.snapshot.paramMap.get('type');
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.userId=userId
    if (type === 'followers') {
      this.selectedTab='followers';
    } else if (type === 'following') {
      this.selectedTab='following';
    }
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log("url",event.url)
        
    //     this.selectedTab = this.activatedRoute.firstChild!.snapshot.data['selectedTab'] ;
        
    //     console.log("selectedTab",this.selectedTab)
        
        
      
    //   }
      
    // });
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.currentUserId=obj.id
      console.log("currentUserId",this.currentUserId)

      this.userService.getDetails(this.userId).subscribe({
        next:(data:any)=>{
          this.username=data.username
        }
      })
  
    this.userService.followUsersList(userId).subscribe({
      next:(data:any) => {
        console.log(data);
        const { following, followers } = data;
        console.log("following array",following)
        console.log("followers array",followers)
        this.followersList=followers;
        this.followingList=following;
      },
      error:(error) =>{
        console.log(error)
      }
    })
  }

  followToggle(userID:any){
    const followButton = document.getElementById('followButton-' + userID);
    this.userService.followToggle(userID).subscribe({
      next:(data) =>{
        console.log(data)
        if(data.toggle==true){
          
          this.following=true
          followButton!.innerText = 'Following';
          console.log(this.following)
          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: userID,
            verb: "started following you.",
            category:"follow",
        }

          this.webSocketService.emit('sendNotifications', {
            notification_receiver: userID,
            verb: `${this.currentUserId,this.currentUserId} started following you.${userID}`
            })
            this.webSocketService.storeNotificationdb(this.notification);
        }
        else if(data.toggle=='requested'){
          this.requested=true
          followButton!.innerText = 'Requested';
          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: userID,
            verb: "requested to follow you.",
            category:"request",
        }
          console.log(data.toggle)
          this.webSocketService.emit('sendNotifications', {
            notification_receiver: userID,
            verb: `${this.currentUserId,this.currentUserId}has requested to follow you.${userID}`,
            });
            this.webSocketService.storeNotificationdb(this.notification);
        }
        else if(data.toggle=='deleted'){
          this.requested=false
          followButton!.innerText = 'Follow';
          this.webSocketService.deleteNotification(this.notification).subscribe({
            next:(data)=>{
              console.log(data)
            },
            error:(error)=>{
              console.log(error)
            }
          });;
        }
        else{
          this.following=false
          followButton!.innerText = 'Follow';

         //for deleteing the notification
          this.notification = {
            notification_sender: this.currentUserId,
            notification_receiver: userID,
            verb: "started following you.",
            category:"follow",
        }  
          this.webSocketService.deleteNotification(this.notification).subscribe({
            next:(data)=>{
              console.log(data)
            },
            error:(error)=>{
              console.log(error)
            }
          });;
        }
      }
    })
  }
  removeFollower(userID:any){
    this.userService.removeFollower(userID).subscribe({
      next:(data:any)=>{
        const removeButton = document.getElementById('removeButton-' + userID);
        console.log(data)
        if(data.removed){
          removeButton!.innerText = 'Add Back';
        }
        else{
          removeButton!.innerText = 'Remove';
        }
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }

  followersItemsToShow(){
    this.itemsToShow+=5
  }

  followingItemsToShow(){
    this.itemsToShow+=5
  }

  reloadPage(selectedTab:any){
    this.router.navigateByUrl('/follow-list', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/follow-list',selectedTab,this.userId]);
    });
    }

  getClassName(){
    if(this.selectedTab=='followers'){
      if(this.itemsToShow >= this.followersList.length){
        return 'hidden'
      }
      else{
        return 'block'
      }
    }
    else{
      if(this.itemsToShow >= this.followingList.length){
        return 'hidden'
      }
      else{
        return 'block'
      }
    }
    
  }

}
