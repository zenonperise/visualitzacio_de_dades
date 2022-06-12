import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable, map, distinctUntilChanged } from 'rxjs';
import { SelectedSprintService } from './selected-sprint.service';
import { featureSelector } from './selector';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeGraphicDataService {

  constructor(private readonly store: Store, private readonly selectedSprintService: SelectedSprintService) {}
  
  getProjectTypes():Observable<string[]> {
    return this.store.pipe(
      select(featureSelector),
      map(state => state.issues),
      distinctUntilChanged(),
      map(issues => issues.map(i => i.projectType)),
      map(projectTypes => [... new Set(projectTypes)]),
      map(projectTypes => {
        const p = [...projectTypes]
        p.sort()
        return p;
      }),
      distinctUntilChanged()
    )
  }

  getData(): Observable<{sprint: string, timeSpentClient: number, timeSpentSupport: number, timeSpentIntern: number}[]> {
    return combineLatest([this.selectedSprintService.getSelectedSprints(),
                          this.store.pipe(
                            select(featureSelector),
                            map(state => state.issues),
                            distinctUntilChanged(),
                            map(issues => issues.flatMap(issue => {
                                const timeSpent = issue.timeSpent || 0
                                const timeSpentBySprint = issue.sprints.length == 0? 0: timeSpent / issue.sprints.length
                                return issue.sprints.map(sprint => ({sprint, projectType: issue.projectType, timeSpent: timeSpentBySprint}))
                              })
                            )),
                          this.store.pipe(
                            select(featureSelector),
                            map(state => state.filter.projectType),
                            distinctUntilChanged()
                          )])
            .pipe(
              distinctUntilChanged(),
              map(([selectedSprints, data, filter])=> {
                if (selectedSprints.length == 0) {
                  return {data, filter}
                }
                return {data: data.filter(d => selectedSprints.indexOf(d.sprint)!=-1), filter}
              }),
              map(({data, filter})=> {
                return data.filter(i => !!filter[i.projectType])
              }),
              map(data => data.reduce((a,b)=>{
                const oldItem = a.find(i => i.sprint == b.sprint) || {sprint: b.sprint, timeSpentClient: 0, timeSpentSupport:0, timeSpentIntern: 0}
                const restList = a.filter(i => i.sprint != b.sprint)
                const updatedElement = (b.projectType == 'SUPPORT')? 
                   {...oldItem, timeSpentSupport: oldItem.timeSpentSupport + b.timeSpent}:
                   (b.projectType == 'INTERN')?
                   {...oldItem, timeSpentIntern: oldItem.timeSpentIntern + b.timeSpent}:
                   {...oldItem, timeSpentClient: oldItem.timeSpentClient + b.timeSpent}
                
                const res = [updatedElement, ...restList ]
                return res
              }, <{sprint: string, timeSpentClient: number, timeSpentSupport: number, timeSpentIntern: number}[]>[])),
              distinctUntilChanged()
          )
  }
}
