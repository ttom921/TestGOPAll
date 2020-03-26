# DVRClient

### 建立DVRClient

```
ng new DVRClient
```

加入Angular Material改成使用下列的指令來建立material

```
ng add @angular/material
```

會出現選擇theme，HammerJS，animation是否加入按照需要

```bash
Installed packages for tooling via npm.
? Choose a prebuilt theme name, or "custom" for a custom theme: Indigo/Pink        [ Preview: https://material.angular.io?theme=indigo-pink ]
? Set up HammerJS for gesture recognition? Yes
? Set up browser animations for Angular Material? Yes
```

加入`socket.io`

```
npm install socket.io --save
```

加入FontAwesome

```
npm install --save @fortawesome/fontawesome-free
```
加入SharedAngularMaterial模組

在DVRClient專案產生

```
ng g m share\SharedAngularMaterial 
```

接下來在`src\styles.scss`中

```scss
@import "~@angular/material/prebuilt-themes/purple-green.css";
@import "~@fortawesome/fontawesome-free/css/all.css";
```
在DVRClient的**AppModule**的模組中`import`這些`SharedAngularMaterialModule`

```typescript
imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedAngularMaterialModule
  ],
```

#### 打造基本後台

加人dashboard的模組

```
ng g m dashboard --routing 
```

加人dashboard的元件

```
ng g c dashboard 
```
在`src\app\dashboard\dashboard.component.html`

```html
<mat-toolbar class="demo-app-header" color="primary">
  <button mat-icon-button (click)="sideNav.toggle()">
    <mat-icon>{{sideNav.opened ? 'close':'menu'}}</mat-icon>
  </button>
  <span>DVRClient demo</span>
  <!-- 在這之後的都會被推到右邊去 -->
  <span class="toolbar-seprator"></span>
  <button mat-icon-button>
    <mat-icon>message</mat-icon>
  </button>
  <button mat-icon-button>
    <mat-icon>exit_to_app</mat-icon>
  </button>

</mat-toolbar>
<mat-sidenav-container class="demo-app-container">
  <mat-sidenav class="demo-app-sidenav" #sideNav mode="push">
    <mat-nav-list>
      <h3 matSubheader>示範用頁面</h3>
      <a [routerLink]="['/', 'dashboard', 'survey']" mat-list-item>問卷調查</a>
      <a [routerLink]="['/', 'dashboard', 'blog']" mat-list-item>部落格</a>
      <a [routerLink]="['/', 'dashboard', 'inbox']" mat-list-item>收件夾</a>
      <mat-divider></mat-divider>
      <!-- 另外一組選單 -->
      <h3 matSubheader>其他頁面</h3>
      <a [routerLink]="['/']" mat-list-item>首頁</a>
      <a [routerLink]="['/']" mat-list-item>Google</a>
      <a [routerLink]="['/']" mat-list-item>Facebook</a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <div style="width: 100%;height: 20em;background-color: blueviolet">

    </div>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>

```

在`src\app\dashboard\dashboard.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clientclassname = this.constructor.name;
  constructor() { }

  ngOnInit() {
  }

}

```

設定css在`src\app\dashboard\dashboard.component.scss`中加入

```scss
mat-sidenav-container{
  width: 100%;
}
.demo-app-header {
    position: fixed;
    top: 0;
    z-index: 2;
  }

  .demo-app-container,
  .demo-app-sidenav {
    position: absolute;
    padding-top: 64px;
    //width: 100%;
 }
.toolbar-seprator{
  flex:1 1 auto;
}
```
設定路由在`src\app\dashboard\dashboard-routing.module.ts`中加入

```typescript
const routes: Routes = [
  {
    path: "", component: DashboardComponent, children: [
      // { path: 'childpath', component: ChildComponent }
    ]
  }
];
```
#### 動態載人dashboard模組

在DVRClient的`src\app\dashboard\dashboard.module.ts`中加入FormsModule,SharedAngularMaterialModule

```
imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ]
```
在DVRClient的`app-routing.module.ts`中加入

```typescript
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule) },
  { path: '**', redirectTo: 'dashboard' }
];

```
#### 加入CarPanel元件

```
ng g c dashboard/CarPanel
```
修改路由在`src\app\dashboard\dashboard-routing.module.ts`中加入

```typescript
const routes: Routes = [
  {
    path: "", component: DashboardComponent, children: [
      { path: "", redirectTo: "carpanel", pathMatch: "full" },
      { path: "carpanel", component: CarPanelComponent }
    ]
  }
];
```
在`src\app\dashboard\car-panel\car-panel.component.html`中加入

```html
<div>
  <mat-label>選擇服務器</mat-label>
  <mat-radio-group [(ngModel)]="selectedip">
    <mat-radio-button id="{{server}}" *ngFor="let server of serverips" [value]="server">
      {{server}}
    </mat-radio-button>
  </mat-radio-group>
  <div>
    你選的服務器: {{selectedip}}
  </div>

</div>
<hr>
<div>
  <mat-label>選擇車牌</mat-label>
  <mat-radio-group [(ngModel)]="selectedcar">
    <mat-radio-button id="{{car}}" *ngFor="let car of cars" [value]="car">
      {{car}}
    </mat-radio-button>
  </mat-radio-group>
  <p>你選的車牌: {{selectedcar}}</p>
</div>
<hr>
```

在`src\app\dashboard\car-panel\car-panel.component.ts`中加入

```typescript
import { Component, OnInit } from '@angular/core';
import { GetCarListService } from 'src/app/service/get-car-list.service';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss']
})
export class CarPanelComponent implements OnInit {
  clientclassname = this.constructor.name;
  //服務器相關
  serverips: string[] = [];
  selectedip = "172.18.2.10";
  serverport = "50001";
  //車子相關
  cars: string[] = [];
  selectedcar = 'car-00';
  constructor(private getCarListService: GetCarListService) {
    this.testGenServerIP();
  }

  ngOnInit() {
    this.getCarListService.getCars(`${this.selectedip}:${this.serverport}`).subscribe((value) => {
      //console.log(value.data);
      this.cars = value.data;
    });
  }

  testGenServerIP() {
    this.serverips.push("172.18.2.10");
    this.serverips.push("172.18.2.44");
    //this.serverips.push("172.18.2.28");//jack
  }
}
```

