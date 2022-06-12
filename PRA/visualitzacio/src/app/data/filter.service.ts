import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { toggle_filter } from './actions';
import { featureSelector } from './selector';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private readonly store: Store) { }

  getFilter(type: 'projectType'|'project'): Observable<{[key:string]:boolean}> {
    return this.store.pipe(
      select(featureSelector),
      map(state => state.filter),
      map(filter => filter[type]),
      distinctUntilChanged()
    )
  }

  toggleFilter(type: 'projectType'|'project', item:string): void{
    this.store.dispatch(toggle_filter({filter:{type, item}}))
  }
}
