# LiveClient

### 建立LiveClient

```
ng new LiveClient
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

在LiveClient專案產生

```
ng g m share\SharedAngularMaterial 
```

接下來在`src\styles.scss`中

```scss
@import "~@angular/material/prebuilt-themes/purple-green.css";
@import "~@fortawesome/fontawesome-free/css/all.css";
```

在LiveClient的**AppModule**的模組中`import`這些`SharedAngularMaterialModule`

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

在LiveClient的`src\app\dashboard\dashboard.module.ts`中加入FormsModule,SharedAngularMaterialModule

```
imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ]
```

在LiveClient的`app-routing.module.ts`中加入

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
  <mat-radio-group [(ngModel)]="selected">
    <mat-radio-button id="{{car}}" *ngFor="let car of cars" [value]="car">
      {{car}}
    </mat-radio-button>
  </mat-radio-group>
  <p>你選的車牌: {{selected}}</p>
</div>
<hr>
<div>
  <mat-label>選擇頻道</mat-label>
  <mat-radio-group [(ngModel)]="selectedchannel">
    <mat-radio-button id="{{channel}}" *ngFor="let channel of channels" [value]="channel">
      {{channel}}
    </mat-radio-button>
  </mat-radio-group>
  <p>你選的頻道: {{selectedchannel}}</p>
</div>
<hr>
<button #vcbtnstart mat-raised-button color="primary" (click)="start()">開始</button>
<app-car-room264 #cr264 [title]="selectedchannel" [socketiourl]="connecturl"></app-car-room264>

```

在`src\app\dashboard\car-panel\car-panel.component.ts`中加入

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CarRoom264Component } from '../car-room264/car-room264.component';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss']
})
export class CarPanelComponent implements OnInit {
  clientclassname = this.constructor.name;
  //html元件相關
  @ViewChild("vcbtnstart", { static: false }) vcbtnstart: MatButton;
  @ViewChild("cr264", { static: false }) cr264: CarRoom264Component;
  //服務器相關
  serverips: string[] = [];
  selserverip = "172.18.2.57";
  serverport = "50001";
  //車子相關
  cars: string[] = [];
  selected = 'car-00';
  connecturl = "";
  curnamspace = "car-888";
  selectedchannel = "channel1";
  channels: string[] = ["channel1", "channel2", "channel3", "channel4", "channel5", "channel6", "channel7", "channel8"];
  constructor() {
    this.testGenServerIP();
    this.testGenCarNum();
  }

  testGenServerIP() {
    this.serverips.push("172.18.2.57");
    this.serverips.push("172.18.2.28");//jack
  }
  testGenCarNum() {
    const carnum = 20;
    for (let index = 0; index < carnum; index++) {
      let fmt = `car-${index < 10 ? "0" + index : index}`;
      this.cars.push(fmt);
    }

  }

  ngOnInit() {
  }
  start() {
    //console.log("start");
    this.vcbtnstart.disabled = true;
    this.curnamspace = this.selected;
    this.connecturl = `http://${this.selserverip}:${this.serverport}/${this.curnamspace}`;
    //console.log(this.connecturl);
    this.cr264.TestStart(this.selected, this.connecturl);
  }

}

```

####　加入影像解碼相關

將相關的檔案放到`src\assets`裏面變成`src\assets\js\jmuxer-master`和`mp3-lame-encoder-js-master`和`hi-player.js`, 然後在`index.html`裏加入來使用

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>LiveClient</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <script src="https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js"></script>
  <script type="text/javascript" src="./assets/js/jmuxer-master/dist/jmuxer.min.js"></script>
  <script>
    // default path is on the same directory as this HTML
    Mp3LameEncoderConfig = {
      memoryInitializerPrefixURL: "./assets/js/mp3-lame-encoder-js-master/lib/"   // must end with slash
      // => changed to javascripts/Mp3LameEncoder.min.js.mem
    };
  </script>
  <script type="text/javascript" src="./assets/js/mp3-lame-encoder-js-master/lib/Mp3LameEncoder.js"></script>
  <script type="text/javascript" src="./assets/js/hi-player.js"></script>

</head>

<body>
  <app-root></app-root>
</body>

</html>

```

**注意**要修改一下hi-player.js裏將`export default`移除



