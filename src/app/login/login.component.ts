import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { UserCredentials } from "../interface/auth";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form:FormGroup;
  serverError=null
  inCorrect=false
  loading=false
  submitted=false
  err:any | undefined;
  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router){
    this.form = this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }
  
  ngOnInit() {}

  get f() { return this.form.controls; }

  logIn(data:any): void{
    this.authService.login(data.username,data.password).subscribe({
      next:(data) => {
        console.log(data);
        this.authService.setLoggedInUser(data);
        this.router.navigateByUrl(`/`)
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
    this.submitted=true;
    if (this.form.invalid) {
      console.log(this.form.errors);
    } else {
      this.loading = true;
      this.logIn(formData);
    }
  }
}
