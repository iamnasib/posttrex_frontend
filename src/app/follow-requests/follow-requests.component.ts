import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { Location } from '@angular/common'
import { SearchUser } from '../interface/search-user';

@Component({
  selector: 'app-follow-requests',
  templateUrl: './follow-requests.component.html',
  styleUrls: ['./follow-requests.component.css']
})
export class FollowRequestsComponent implements OnInit {

  json:any;
  currentUserID:any;
  followRequests:SearchUser[]=[];
  sentFollowRequests:SearchUser[]=[];
  following:any;
  requestAccepted:any
  requestDeleted:any
  requested:any
  itemsToShow=10
  notification;
  selectedTab='';
  contentLoaded=false;
  constructor(
    private activatedRoute: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private webSocketService: WebsocketService,
      private location: Location,
  ){
    this.notification = {
      notification_sender: null,
      notification_receiver: null,
      verb: "",
      category:"",
  }
  }

  ngOnInit(): void {
    const type = this.activatedRoute.snapshot.paramMap.get('type');
    if (type === 'received') {
      this.selectedTab='received';
    } else if (type === 'sent') {
      this.selectedTab='sent';
    }
    this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      console.log("obj.id:",obj.id)
      this.currentUserID = obj.id
      console.log("json:",this.currentUserID)

      this.userService.followRequestsList(this.currentUserID).subscribe({
        next:(data) => {
          console.log(data)
          const { requested_to, requested_by } = data;
          console.log("requested_to array",requested_to)
          console.log("requested_by array",requested_by)
          this.followRequests = requested_by
          this.sentFollowRequests = requested_to
          console.log(this.sentFollowRequests)
          this.contentLoaded=true
        }
      });
  }

  selectedUserId: any;

selectUser(userId: number) {
  this.selectedUserId = userId;
}

  acceptFollowRequest(userID:any){
    const deleteButton = document.getElementById('deleteButton-' + userID);
    
    const acceptButton = document.getElementById('acceptButton-' + userID);
    console.log(acceptButton!.innerText)
    if(acceptButton!.innerText == 'Accept'){
      console.log('if',acceptButton!.innerText)
    this.userService.acceptFollowRequest(userID).subscribe({
      next:(data) =>{
        console.log(data)
        this.selectedUserId = userID;
        this.requestAccepted=true
        deleteButton?.remove()
        acceptButton!.innerText = 'Accepted'
        //following list:
        
             
              
         
              
          },
          error:(error)=>{
            console.log(error);
          }
        });

        
        
      }
  }

  deleteFollowRequest(userID:any){
    const acceptButton = document.getElementById('acceptButton-' + userID);
    console.log(acceptButton!.innerText)
    const deleteButton = document.getElementById('deleteButton-' + userID);
    console.log(deleteButton!.innerText)
    this.userService.deleteFollowRequest(userID).subscribe({
      next:(data) =>{
        this.selectedUserId = userID;
        console.log(data)
        this.requestDeleted=true
        acceptButton?.remove()
        deleteButton?.remove()
      }
    })
  }
  reloadPage(selectedTab:any){
    this.router.navigateByUrl('/follow-requests', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/follow-requests',selectedTab]);
    });
    }

  followToggle(userID:any){
    const acceptButton = document.getElementById('acceptButton-' + userID);
    this.userService.followToggle(userID).subscribe({
      next:(data) =>{
        console.log(data)
        if(data.toggle==true){
          
          this.following=true
          acceptButton!.innerText = 'Following';
          console.log(this.following)
          this.notification = {
            notification_sender: this.currentUserID,
            notification_receiver: userID,
            verb: "started following you.",
            category:"follow",
        }

          this.webSocketService.emit('sendNotifications', {
            notification_receiver: userID,
            verb: `${this.currentUserID,this.currentUserID} started following you.${userID}`
            })
            this.webSocketService.storeNotificationdb(this.notification);
        }
        else if(data.toggle=='requested'){
          this.requested=true
          acceptButton!.innerText = 'Requested';
          this.notification = {
            notification_sender: this.currentUserID,
            notification_receiver: userID,
            verb: "requested to follow you.",
            category:"request",
        }
          console.log(data.toggle)
          this.webSocketService.emit('sendNotifications', {
            notification_receiver: userID,
            verb: `${this.currentUserID,this.currentUserID}has requested to follow you.${userID}`,
            });
            this.webSocketService.storeNotificationdb(this.notification);
        }
        else if(data.toggle=='deleted'){
          this.requested=false
          acceptButton!.innerText = 'Follow';
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
          this.notification = {
            notification_sender: this.currentUserID,
            notification_receiver: userID,
            verb: "started following you.",
            category:"follow",
        }
          this.following=false
          acceptButton!.innerText = 'Follow';
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
  SearchItemsToShow(){
    this.itemsToShow+=5
  }

  getClassName(){
    if(this.selectedTab=='received'){
      if(this.itemsToShow >= this.followRequests.length){
        return 'hidden'
      }
      else{
        return 'block'
      }
    }
    else{
      if(this.itemsToShow >= this.sentFollowRequests.length){
        return 'hidden'
      }
      else{
        return 'block'
      }
    }
    
  }
}