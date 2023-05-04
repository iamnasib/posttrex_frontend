import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.css']
})
export class SendFeedbackComponent implements OnInit {
  loading=false
  form:FormGroup|any;
  showAlert=false;
  message='';
  constructor(private formBuilder:FormBuilder, private userService:UserService){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      feedback_text: ['', Validators.required],
    });
  }

  sendFeedback(formData:any){
    this.userService.sendFeedback(formData).subscribe({
      next:(data:any)=>{
        console.log(data)
        if(data.status==true){
          this.showAlert=true
          this.message='Feedback sent succesfully';
        }
        this.loading = false;
      },
      error:(err)=>{
        console.log(err)
        this.showAlert=true
        this.message='Error, Please try again later';
        this.loading = false;
      }
    })
  }

  onSubmit(formData:any){
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.loading = true;
      this.sendFeedback(formData);
    }
  }
}
