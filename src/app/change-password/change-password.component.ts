import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup,FormControl } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router,ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form:any;
  serverError=null;
  submitted=false;
  json:any
  id:any
  loading=false;
  inCorrect=false;
  err:any;
  constructor(private formBuilder:FormBuilder, private router:Router, private authService:AuthService){}
  ngOnInit(): void {
    this.loading = true;
    this.form = this.formBuilder.group({
      old_password: ['', Validators.required],
     
      password: ['', Validators.required],
      
      password2: ['', Validators.required],
    });
      console.log("helo",localStorage.getItem('userData'))
      this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      console.log(obj.id)
      this.id=obj.id
      console.log(this.id)
      this.loading = false;
  }

  get f() { return this.form.controls; }

  changePassword(data:any){
    this.loading = true;
    if (!this.form.valid) {
      console.log(this.form.value);
      return;
    }
    
    this.authService.changePassword(this.id,data).subscribe({
      next:(data) => {
        console.log(data);
        this.router.navigateByUrl(`/profile/${this.id}`)
      },
      error:(error) => {
        this.err=error;
        this.loading = false;
        if (error && error.error && typeof error.error !== 'object') {
          this.serverError = error.error;
          console.log(this.serverError)
          this.loading = false;
        }
        this.inCorrect = true;
      }
    })
  }

  onSubmit(formData:any): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.loading = true;
      this.changePassword(formData);
    }
  }
}
