import { Component,OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username:any;
  id:any;
  json:any;
  userProfile:any;
  title:any;
  constructor(private router: Router, private userService:UserService,private location:Location,
    private activatedRoute: ActivatedRoute){

  }
  ngOnInit(): void {
    if(localStorage.getItem('userData')){
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.id=obj.id
      this.username=obj.username
      }
      if(window.location.pathname=='/notifications'){
        this.title='Notifications'
      }
      else{
        this.title=null
      }
    
    this.router.events.subscribe((event) => {
    if(event instanceof NavigationStart){
      if(event.url=='/edit-profile' || event.url=='/change-password' || event.url=='/settings')
    {
      this.userService.getDetails(this.id).subscribe({
        next:(data) => {
          console.log(data);
          const userObj=JSON.stringify(data)
          const usernameObj=JSON.parse(userObj)
          this.username=usernameObj.username
          console.log(usernameObj.username)
        },
        error:(error)=>{
          console.log(error);
        }
      })
    }
  }
  });
}
backClick() {
  this.location.back();
}
showOptions(){
  if(window.location.pathname=='/edit-profile' || window.location.pathname=='/change-password'
   || window.location.pathname=='/settings' || window.location.pathname=='/chat' || window.location.pathname=='/notifications'
   || window.location.pathname=='/blocked-accounts' || window.location.pathname=='/follow-requests'|| window.location.pathname=='/follow-list/following'
   || window.location.pathname=='/follow-list/followers' || window.location.pathname=='/send-feedback')
  {
    return false
  }
  else{
    return true
  }
}
}
