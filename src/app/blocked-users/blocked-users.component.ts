import { Component,OnInit } from '@angular/core';
import { SearchUser } from '../interface/search-user';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit {
  json:any;
  currentUserId:any;
  blockedUsersList:SearchUser[]=[];
  itemsToShow=15;
  
  

  constructor(private userService: UserService,private webSocketService: WebsocketService,
    private router:Router,private activatedRoute: ActivatedRoute){

    
  }

  ngOnInit(): void {
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.currentUserId=obj.id
      console.log("currentUserId",this.currentUserId)
  
      this.userService.blockedUsers(this.currentUserId).subscribe({
        next:(data) => {
          console.log(data);
          
          const { blocked_user, blocked_by } = data;
          console.log("blocked_user array",blocked_user)
          console.log("blocked_by array",blocked_by)
          this.blockedUsersList=blocked_user;

  }
  });
}
blockUser(userId:any){
  const data =  { 'blocked_user': userId, 'blocked_by': this.currentUserId }
  const blockButton = document.getElementById('blockButton-' + userId);
  this.userService.blockUser(this.currentUserId,data).subscribe({
    next:(data) =>{
      console.log(data)
      if(data.blocked){
        blockButton!.innerText = "Unblock"
      }
      else{
        blockButton!.innerText = "Block"
      }
    }
  });
}
}
