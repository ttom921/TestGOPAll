import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-carlogin',
  templateUrl: './carlogin.component.html',
  styleUrls: ['./carlogin.component.scss']
})
export class CarloginComponent implements OnInit {

  username: string;
  password: string;
  showSpinner: Boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toasterService: ToasterService) { }

  ngOnInit() {
  }
  login() {
    try {
      this.auth.login(this.username, this.password).subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
          //console.log(error);
          this.toasterService.showToaster(error.statusText);
          //this.toasterService.showToaster(error.error.message);
        }

      );

    } catch (error) {
      console.log(error);
    }
  }
}
