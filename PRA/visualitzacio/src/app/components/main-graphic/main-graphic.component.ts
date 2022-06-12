import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { delay, map, mapTo, Observable, of, ReplaySubject, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-main-graphic',
  templateUrl: './main-graphic.component.html',
  styleUrls: ['./main-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainGraphicComponent implements AfterViewInit{
  @ViewChild(MatTabGroup) matTabGroup!: MatTabGroup

  _notifyChange: Subject<number> = new ReplaySubject();
  constructor() { }

  get notifyChange():Observable<number> {
    return this._notifyChange.asObservable().pipe(
      startWith(0),
    )
  }

  ngAfterViewInit(): void {
      this.matTabGroup.animationDone.asObservable()
        .pipe(map(_=> this.matTabGroup.selectedIndex || 0))
        .subscribe(i=> this._notifyChange.next(i))
  }

  

}
