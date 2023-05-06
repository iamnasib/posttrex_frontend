import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditProfileGuard implements CanActivate {
  json:any;
  constructor(private router: Router) {}
  canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(localStorage.getItem('userData')){
        
        this.router.navigateByUrl(`/home`) //change /edit-profile/ to home 
          return false;
      }
      else{
        return true;
      }
  }
  //edit profile & register
}
