import { Component, OnInit } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Car } from '../models/car';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clientclassname = this.constructor.name;
  isLoggedIn$: Observable<boolean>;
  constructor(
    private router: Router,
    private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    console.log(this.clientclassname+"->"+this.isLoggedIn$);
  }

  ngOnInit() {

  }
  toggleSideNav(sideNav: MatSidenav) {
    sideNav.toggle().then((result: MatDrawerToggleResult) => {
      //console.log(result);
      //console.log(`選單狀態:${result}`);
    });

  }
  opened() {
    //console.log("芝麻開門");
  }
  closed() {
    //console.log("芝麻關門");
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/carlogin']);
  }
}
