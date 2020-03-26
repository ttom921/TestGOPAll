import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { TouchSequence } from 'selenium-webdriver';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  showSpinner = "none";
  constructor(
    private router: Router,
    private auth: AuthService,
    private toasterService: ToasterService) { }

  ngOnInit() {
    // console.log(this.auth.test());
  }
  login() {
    try {
      this.auth.login(this.username, this.password).subscribe(
        data => {
          //this.router.navigate("[this.returnUrl]");
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
