import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, Observable } from 'rxjs';
import { load } from './actions';
import { featureSelector, dataLoadedSelector } from './selector';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private readonly store: Store) { }

  public getLoadedFlag(): Observable<boolean> {
    return this.store.pipe(
      select(featureSelector),
      select(dataLoadedSelector),
      distinctUntilChanged()
    )
  }

  public loadData(): void {
    
      this.store.dispatch(load())
  }
}
