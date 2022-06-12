import { Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'visualitzacio';
}
