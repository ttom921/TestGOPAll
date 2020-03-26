import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fold-test',
  templateUrl: './fold-test.component.html',
  styleUrls: ['./fold-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoldTestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  changeListener($event): void {
    console.log($event);
    var files = $event.target.files;
    for (let index = 0; index < files.length; index++) {
      const curFile = files[index];
      console.log(curFile.webkitRelativePath);
    }
    // for (var indx in files) {
    //   var curFile = files[indx];
    //   console.log(curFile.webkitRelativePath);
    //   //console.log(curFile.slice(0, curFile.size));
    // }
    console.log(files);
  }
}
