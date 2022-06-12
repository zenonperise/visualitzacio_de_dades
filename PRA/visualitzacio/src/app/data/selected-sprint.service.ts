import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { reset_sprint_selection, set_sprint_selection } from './actions';
import { AllDataService } from './all-data.service';
import { featureSelector } from './selector';

@Injectable({
  providedIn: 'root'
})
export class SelectedSprintService {

  constructor(private readonly store: Store, private readonly allDataService: AllDataService) { }

  setSelectedSprints(sprint1: string, sprint2: string): void {
    this.store.dispatch(set_sprint_selection({ini: sprint1, end:sprint2}))
  }

  resetSelectedSprints(): void {
    this.store.dispatch(reset_sprint_selection())
  }

  calculateSelectedSprints(sprints: string[], ini: string, end: string): string[] {
      const index = [sprints.indexOf(ini), sprints.indexOf(end)]
      index.sort()
      return sprints.slice(index[0], index[1])
  }

  getSelectedSprints():Observable<string[]> {
    return combineLatest([this.allDataService.getAllSortedSprints(), 
      this.store.pipe(
        select(featureSelector),
        map(state => state.selectedSprint),
        distinctUntilChanged()
      )]).pipe(
        map(([sprints, selectedSprint])=> {
          if (!selectedSprint) {
            return []
          } else {
            return this.calculateSelectedSprints(sprints, selectedSprint.ini, selectedSprint.end)
          }
        }
      ),
      distinctUntilChanged()
    )
  }
}
