import { Component,OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  json:any;
  id:any;
  loading=false;
  serverError=null;
  showAccountOption=false;
  showPrivacyOption=false;
  isPrivate:any;
  isVerified:any;
  userProfile:any;
  showAlert: boolean=false;
  message: string='';
  constructor(private location: Location,private authService:AuthService,private router:Router,
    private userService:UserService){}

  ngOnInit(): void {
    this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      this.id=obj.id


      this.userService.getDetails(this.id).subscribe({
        next:(data) => {
          console.log(this.isPrivate)
          const userObj=JSON.stringify(data)
          this.userProfile=JSON.parse(userObj)
          this.isPrivate=this.userProfile.is_private
          this.isVerified=this.userProfile.is_verified
          console.log(this.isPrivate,this.isVerified)
          
        },
        error:(error)=>{
          console.log(error);
        }
      })
  }

  backClick(){
    this.location.back();
  }

  requestVerification(){
    this.authService.requestVerification().subscribe({
      next:(data:any)=>{
        console.log(data)
        if(data.status==true){
          this.message='Verification request sent!'
          this.showAlert=true
          
        }
        else{
          this.message='Verification request already exists!'
          this.showAlert=true
          
        }
      }
    })
  }

  showAccountOptionElement(){
    if(this.showAccountOption==false){
      this.showAccountOption=true
    }
    else{
      this.showAccountOption=false
    }
    
  }
  showPrivacyOptionElement(){
    if(this.showPrivacyOption==false){
      this.showPrivacyOption=true
    }
    else{
      this.showPrivacyOption=false
    }
    
  }
  sendValue(){
    const data = { is_private: this.isPrivate };
    const formData =  new FormData();
    formData.append('is_private', this.isPrivate);
    this.userService.privateAccount(this.id, formData).subscribe(response => {
      console.log('Response:', response);
    });
  }

  Logout() {
    this.loading = true;
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
    this.loading = false;
    this.router.navigateByUrl(`/login`)
  }
}
