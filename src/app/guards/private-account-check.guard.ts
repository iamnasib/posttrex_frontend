import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateAccountCheckGuard implements CanActivate {

  isPrivate:any

  constructor(private router: Router, private userService:UserService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.userService.checkPrivateAccount().subscribe({
        next: (data) => {
          this.isPrivate= data.is_private
      }
    });
    if (this.isPrivate) {
      return true
  }
  else{
    this.router.navigate(['/home'])
    return false;
  }
    
  }
  
}
