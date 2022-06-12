import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { load, loaded_failed, loaded_success } from './actions';
import { IssueInputList } from './types';

@Injectable({
  providedIn: 'root'
}) 
export class EffectsService {
  
  constructor(private readonly actions: Actions, private readonly http: HttpClient) { }

  loadEffect = createEffect(
    () => this.actions.pipe(
      ofType(load),
      mergeMap(_ => this.http.get<IssueInputList>('assets/issues.json').pipe(
        map(data => loaded_success({data})),
        catchError(error => of(loaded_failed(error)))
      ))),
      { useEffectsErrorHandler: false }
  )
}
