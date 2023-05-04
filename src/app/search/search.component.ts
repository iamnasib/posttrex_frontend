import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from "src/environments/environment"
import { SearchUser } from '../interface/search-user';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  SERVER_URL:string;
  searchResults: SearchUser[]=[];
  itemsToShow=6;
  loading=false
  constructor(private userService:UserService, private location: Location) { 
    this.SERVER_URL = environment.serverURL;
   }

  ngOnInit() {
    
  }
  backClick() {
    this.location.back();
  }

  search(event: Event) {
    console.log((event.target as HTMLTextAreaElement).value)
    this.loading=true
    this.userService.searchUsers((event.target as HTMLTextAreaElement).value)
      .subscribe(data => {
        console.log(data)
        const userObj=JSON.stringify(data)
        const usernameObj=JSON.parse(userObj)
        this.searchResults=[]
        this.itemsToShow=5
        this.searchResults=usernameObj;
        console.log(this.searchResults)
        this.loading=false
        
        
  }) 
}
SearchItemsToShow(){
  this.loading=true
  this.itemsToShow+=4
  this.loading=false
}
getClassName(){
  if(this.itemsToShow >= this.searchResults.length){
    return 'hidden'
  }
  else{
    return 'block'
  }
}
}