import { Component,inject,Inject,OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup,AbstractControl } from "@angular/forms";
import { UserService } from "../services/user.service";
import { Router,ActivatedRoute, Data } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoggedInUser } from '../interface/auth';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  form:FormGroup|any;
  serverError=null
  inCorrect=false
  loading=false
  json:any;
  submitted=false
  id:any;
  err:any | null;
  avatarUrl:any;
  setLoggedInUser!:LoggedInUser
  currentUsername:any
  contentLoaded=false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor( private userService:UserService, private router:Router,
    private formBuilder:FormBuilder, private activatedRoute:ActivatedRoute,private authService: AuthService,
    private location:Location){
      this.loading = true;
    }
    
  ngOnInit(): void {
    
    this.form = this.formBuilder.group({
      full_name: ['', Validators.required],
     
      username: ['', Validators.required],
      
      email: ['', Validators.required],

      intro: [''],
     
      website: [''],
      
      mobile_number: [''],

     avatar: [null],
     fileSource: [''],
      
    });
      console.log("helo",localStorage.getItem('userData'))
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      console.log(obj.id)
      this.id=obj.id
      this.currentUsername=obj.username
      console.log(this.id)
      this.getUserDetails();

  }

  onFileChanged(event:any) {
    this.loading = true;
    this.form.get('avatar').setValue(event.target.files[0]); 
    this.update()
    
}

  getUserDetails() {
    if (this.id) {
      this.userService
        .getDetails(this.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (res: any) => {
            const resObj: any = res;
            if (resObj) {
              this.avatarUrl=resObj.avatar
              this.form.patchValue({
                full_name: resObj.full_name,
                email: resObj.email,
                username: resObj.username,
                intro: resObj.intro,
     
                website: resObj.website,
                
                mobile_number: resObj.mobile_number,
                
              });
              this.contentLoaded=true
            }
          },
          
        );
    }
    
    this.loading = false;
  }

  backClick() {
    this.router.navigateByUrl(`/${this.currentUsername}`)
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  update() {
    this.loading = true;
    console.log(this.form.get('avatar').value)
    console.log( this.form.get('fileSource').value)
    const formData =  new FormData();
    formData.append('full_name', this.form.get('full_name').value);
    formData.append('username', this.form.get('username').value);
    formData.append('email', this.form.get('email').value);
    formData.append('intro', this.form.get('intro').value);
    formData.append('website', this.form.get('website').value);
    if(this.form.get('avatar').value){
      formData.append('avatar', this.form.get('avatar').value);
    }
    console.log(this.form.get('username').value)
    formData.append('mobile_number', this.form.get('mobile_number').value);
    this.userService.updateUserDetails(this.id,formData).subscribe({
      next:(data) => {
        console.log(data);
        this.json=localStorage.getItem('userData');
        const obj = JSON.parse(this.json)
        const { id, token } = obj;
        const username = this.form.get('username').value;
        this.setLoggedInUser = { id, token, username };
        
        this.authService.setLoggedInUser(this.setLoggedInUser);
        this.ngOnInit()
        this.loading = false;
      },
      error:(error) => {
        this.err=error;
        this.loading = false;
        // console.log(error.error.username.toString())
        // for (let err in error.error.key){
        //     console.log("err",err)
        // }
        if (error && error.error && typeof error.error !== 'object') {
          this.serverError = error.error;
          console.log(this.serverError)
          this.loading = false;
        }
        
        this.inCorrect = true;
      }
    })
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.loading = true;
      this.update();
    }
  }
  
}