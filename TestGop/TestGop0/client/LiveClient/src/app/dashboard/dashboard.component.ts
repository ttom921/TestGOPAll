import { Component, HostBinding, OnInit } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clientclassname = this.constructor.name;
  //取得css的class
  @HostBinding('class') componentCssClass;

  isLoggedIn$: Observable<boolean>;
  //theme = 'custom-theme-1';
  theme = 'my-light1-theme';

  constructor(
    private overlayContainer: OverlayContainer,
    private router: Router,
    private auth: AuthService) {


    this.isLoggedIn$ = this.auth.isLoggedIn();
    console.log(this.clientclassname + "->" + this.isLoggedIn$);
  }
  ngOnInit() {
    //設定初始化主題
    this.componentCssClass = this.theme;
  }
  toggleSideNav(sideNav: MatSidenav) {
    sideNav.toggle().then((result: MatDrawerToggleResult) => {
      // console.log(result);
      // console.log(`選單狀態:${result}`);
    });

  }
  opened() {
    //console.log("芝麻開門");
  }
  closed() {
    //console.log("芝麻關門");
  }
  logout() {
    //console.log("logout");
    this.auth.logout();
    this.router.navigate(['/dashboard/login']);
  }
  toggleTheme() {
    const originalTheme = this.theme;
    //this.theme = this.theme === 'custom-theme-1' ? 'custom-theme-2' : 'custom-theme-1';
    this.theme = this.theme === 'my-light1-theme' ? 'my-dark1-theme' : 'my-light1-theme';
    //this.overlayContainer.getContainerElement().classList.remove(originalTheme);
    this.overlayContainer.getContainerElement().classList.add(this.theme);
    this.componentCssClass = this.theme;
  }
}
