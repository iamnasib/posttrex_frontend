import { Component,EventEmitter,OnInit, Output,ViewChild, AfterViewChecked, AfterViewInit,ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common'
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-message-window',
  templateUrl: './message-window.component.html',
  styleUrls: ['./message-window.component.css'],
  providers: [UserService,WebsocketService]
})
export class MessageWindowComponent implements OnInit,AfterViewInit,AfterViewChecked{
  
  prevmessages:any[]=[];
  sender:any;
  users:any;
  receiver:any;
  message: string;
  chatdetails;
  sentdate:any;
  currentUser:any;
  json:any;
  messages;
  recieverUsername:any;
  usernameObj:any;
  showOptionsElement=false
  showModal=false
  isBlockedByCrntUser=false;
  crntUserIsBlocked=false;
  showScrollToBottomButton: boolean=false;
  contentLoaded=false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private webSocketService: WebsocketService,
      private location: Location,
      ) { 
          this.message = "";

          this.chatdetails = {
              sender: null,
              receiver: null,
              textcontent: "",
              // data:{}
          }

          this.messages = [{
              msg: "",
              senderid: 0,
              receiverid: 0
          }];

          
      }
  
  showOptions(){
    if(this.showOptionsElement==false){
      this.showOptionsElement=true
    }
    else{
      this.showOptionsElement=false
    }
  }
  toggleModal(){
    if(this.showModal==false){
      this.showModal=true
    }
    else{
      this.showModal=false
    }
  }

  

  ngOnInit(){
    
    
    this.route.paramMap.subscribe(params => {
          
      this.recieverUsername = params.get('username');
    
      
    });
    console.log("recievere",this.recieverUsername)
    this.webSocketService.MarkMessagesAsRead(this.recieverUsername).subscribe({
      next:(data:any)=>{
        console.log(data)
      }
    })
    this.json=localStorage.getItem('userData');
      const obj = JSON.parse(this.json)
      console.log("obj.id:",obj.id)
      this.sender = obj.id
      console.log("json:",this.sender)
      this.userService.geCurrentUserDetails(this.sender).subscribe({
        next:(data:any) => {
          this.currentUser=data;
          this.userService.blockedUsers(this.sender).subscribe({
            next:(data) => {
              console.log(data);
              
              const { blocked_user, blocked_by } = data;
              console.log("blocked_user array",blocked_user)
              console.log("blocked_by array",blocked_by)
              for (let i = 0; i < blocked_user.length; i++) {
                console.log(blocked_user[i],this.sender);
  
                if(blocked_user[i].id==this.receiver){
                  this.isBlockedByCrntUser=true //redirect or display not found page
                  break;
                }
              }console.log("isBlockedByCrntUser",this.isBlockedByCrntUser)  
                for (let i = 0; i < blocked_by.length; i++) {
                  console.log(blocked_by[i]);
                  if(blocked_by[i].id==this.receiver){
                    this.crntUserIsBlocked=true 
                    break;
                  }

              } 
              console.log("crntUserIsBlocked",this.crntUserIsBlocked)
            },
            error:(error)=>{
              console.log(error);
            }
          })
        }
      })

    this.userService.getDetailsByUsername(this.recieverUsername).subscribe({
      next:(data) => {
        console.log(data);
        const userObj=JSON.stringify(data)
        this.usernameObj=JSON.parse(userObj)
        this.receiver=this.usernameObj.id
        console.log(this.usernameObj.id)
        console.log(this.receiver)
        this.webSocketService
          .getPrevMessages(this.receiver)
          .subscribe((data: any) => {
              console.log(data)
              this.prevmessages = data;
              const obj=JSON.stringify(data)
              const messagesObj=JSON.parse(obj)
            
              this.prevmessages=messagesObj;
              console.log('length',this.prevmessages.length)
              console.log(document.body.scrollHeight); 
              this.contentLoaded=true
              this.scrollToBottom();  
            });
            console.log("scroll")
            
      },
      error:(error)=>{
        console.log("error")
        console.log(error);
      }
      
    })
        this.webSocketService.emit('join', {userid:this.sender});

        this.webSocketService.getMessages().subscribe({
          next:(data:any) => {
            console.log(data);
            this.messages.push(data);
            
          },
          error:(error) => {
            console.log(error);
            if (error && error.error && typeof error.error !== 'object') {
              console.log(error.error);
            }
            
          }
        });
        
  }
  // @ViewChildren('messages') msgs!: QueryList<any>;
// @ViewChild('content') content!: ElementRef;
//   ngAfterViewInit() {
//     this.scrollToBottom();  

//     }
//     scrollToBottom(): void {
//       try {
//         this.content.nativeElement.scroll({
//           top: this.content.nativeElement.scrollHeight,
//           left: 0,
//           behavior: 'smooth'
//         });
//       } catch (err) {}            
//   }
private messageWindow: any;
ngAfterViewInit() {
      
  this.messageWindow = document.getElementById('messageContainer');
  setTimeout(() => {
    this.scrollToBottom();
  }, 0);
      }

      ngAfterViewChecked() {
        this.messageWindow = document.getElementById('messageContainer');
        this.scrollToBottom();
      }

  
onMessageContainerScroll() {
        // Check if user has scrolled up
        console.log("test")
  if (this.messageWindow.scrollTop > 0) {
    this.showScrollToBottomButton = true;
  } else {
    this.showScrollToBottomButton = false;
  }
      }

scrollToBottom() {
  try{
    this.messageWindow.scrollTop = this.messageWindow.scrollHeight;

    }
    catch(err){
      console.log(err)
    }
  
}

  backClick() {
    this.location.back();
  }

  sendMessage() {
    
      this.chatdetails = {
          sender: this.sender,
          receiver: this.receiver,
          textcontent: this.message,
          // data:{'comment':'comment'}
      }

      if(this.message != ""){
          this.messages.push({msg: this.message, senderid: this.sender, receiverid: this.receiver})
          console.log(this.messages)
          
          
          
          this.webSocketService.emit("new-message", {receiverid: this.receiver, msg: this.message, senderid: this.sender});
          // this.webSocketService.emit('sendNotifications', {
          //   message: `New Notification.`,
          //   sender: this.sender,
          //   reciever: this.receiver})
          this.scrollToBottom();
          this.webSocketService.storeMessagedb(this.chatdetails);
          this.message = '';
      }
      
      // this.messageInput.nativeElement.focus();
  }

  blockUser(){
    const data =  { 'blocked_user': this.receiver, 'blocked_by': this.sender }
    
    this.userService.blockUser(this.sender,data).subscribe({
      next:(data) =>{
        console.log(data)
        
      }
    });
    this.isBlockedByCrntUser=false;
    this.crntUserIsBlocked=false;
    this.ngOnInit()
  }

  deleteChat(){
    this.webSocketService.deleteMessages(this.receiver).subscribe({
      next:(data)=>{
        console.log(data)
        this.showModal=false
        this.router.navigateByUrl('/chat')
      }
    })
  }
}
