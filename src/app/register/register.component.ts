import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup,FormControl } from "@angular/forms";
import { RegisterService } from "../services/register.service";
import { UserCredentials } from "../interface/auth";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // form:FormGroup;
  form:any;
  serverError=null
  inCorrect=false
  loading=false
  submitted=false
  err:any | undefined;
  successMessage:any;
  constructor( private registerService:RegisterService, private router:Router,
    private formBuilder:FormBuilder){
      
    }
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      full_name: ['',],
      password: ['', Validators.required],
      username: ['', Validators.required],
      password2: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
  });
    
   }

  get f() { return this.form.controls; }

  signUp(data:any) :void {
    if (!this.form.valid) {
      this.loading = false;
      return;
    }
    this.registerService.register(data).subscribe({
      next:(data) => {
        console.log(data);
        this.loading = false;
        this.successMessage="Account created succesfully"
      },
      error:(error) => {
        this.err=error;
        this.loading = false;
        if (error && error.error && typeof error.error !== 'object') {
          this.serverError = error.error;
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
    } else {
      this.loading = true;
      this.signUp(formData);
    }
  }
}
