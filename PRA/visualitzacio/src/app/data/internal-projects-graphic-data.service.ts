import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store'
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { SelectedSprintService } from './selected-sprint.service';
import { featureSelector } from './selector';

@Injectable({
  providedIn: 'root'
})
export class InternalProjectsGraphicDataService {

 constructor(private readonly store: Store, private readonly selectedSprintService: SelectedSprintService) {}
  
  getProjects():Observable<string[]> {
    return this.store.pipe(
      select(featureSelector),
      map(state => state.issues),
      distinctUntilChanged(),
      map(issues => issues.filter(i => i.projectType == 'INTERN').map(i => i.project)),
      map(projects => [... new Set(projects)]),
      map(projects => {
        const p = [...projects]
        p.sort()
        return p;
      }),
      distinctUntilChanged()
    )
  }

  getData(): Observable<{sprint: string, totalTimeSpent: number, timeSpent: {[key:string]:number}}[]> {
    return combineLatest([this.selectedSprintService.getSelectedSprints(),
                          this.store.pipe(
                            select(featureSelector),
                            map(state => state.issues),
                            distinctUntilChanged(),
                            map(issues => issues.filter(issue => issue.projectType == 'INTERN')),
                            map(issues => issues.flatMap(issue => {
                                const timeSpent = issue.timeSpent || 0
                                const timeSpentBySprint = issue.sprints.length == 0? 0: timeSpent / issue.sprints.length
                                return issue.sprints.map(sprint => ({sprint, project: issue.project, timeSpent: timeSpentBySprint}))
                              })
                            )),
                          this.store.pipe(
                            select(featureSelector),
                            map(state => state.filter.project),
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
                return data.filter(i => !!filter[i.project])
              }),
              map(data => data.reduce((a,b)=>{
                
                const oldItem = a.find(i => i.sprint == b.sprint) || {sprint: b.sprint, totalTimeSpent: 0, timeSpent: {}}
                const restList = a.filter(i => i.sprint != b.sprint)
                const oldItemTimeSpent = oldItem.timeSpent
                const updatedTimeSpent = {...oldItemTimeSpent,  [b.project]: (oldItemTimeSpent[b.project] ||0) + b.timeSpent }
                const updatedElement = {...oldItem, totalTimeSpent: oldItem.totalTimeSpent + b.timeSpent,timeSpent: updatedTimeSpent}
                
                const res = [...restList, updatedElement ]
                return res
              }, <{sprint: string, totalTimeSpent: number, timeSpent: {[key:string]:number}}[]>[])),
              distinctUntilChanged()
          )
  }
}
