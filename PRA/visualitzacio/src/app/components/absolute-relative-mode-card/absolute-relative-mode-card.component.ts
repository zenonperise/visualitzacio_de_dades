import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
  selector: 'app-absolute-relative-mode-card',
  templateUrl: './absolute-relative-mode-card.component.html',
  styleUrls: ['./absolute-relative-mode-card.component.scss']
})
export class AbsoluteRelativeModeCardComponent implements AfterViewInit {

  @ViewChild(MatCheckbox) checkBox!: MatCheckbox

  @Output()
  modeChange: EventEmitter<{relative:boolean}> = new EventEmitter<{relative:boolean}>()

  constructor() { }

  ngAfterViewInit(): void {
      this.checkBox.change.subscribe(changeEvent => {
        this.modeChange.emit({relative: changeEvent.checked});
      })
  }


}
