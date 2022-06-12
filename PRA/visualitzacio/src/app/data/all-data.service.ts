import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { load } from './actions';
import { featureSelector } from './selector';

@Injectable({
  providedIn: 'root'
})
export class AllDataService {

  constructor(private readonly store: Store) {
    this.store.dispatch(load())
   }

  getAllSortedSprints(): Observable<string[]> {
    return this.store.pipe(
      select(featureSelector),
      map(state => state.issues),
      map(issues => issues.flatMap(issue => issue.sprints)),
      map(sprints => new Set(sprints)),
      map(sprints => [...sprints]),
      map(sprints => {
        const res = [...sprints]
        res.sort((a, b)=> {
          const regEx = new RegExp('\\d+')
          const aNum = a.split(' ').map(s => s.trim()).filter(i => regEx.test(i)).map(i => parseInt(i)).find(i=>true) 
          const bNum = b.split(' ').map(s => s.trim()).filter(i => regEx.test(i)).map(i => parseInt(i)).find(i=>true) 
          if (!aNum) {
            return -1
          }
          if (!bNum) {
            return 1
          }
          return aNum - bNum
        })
        return res
      }),
      distinctUntilChanged()
    )
  }

  getAllDataSprintTimeSpent(projectType?:string): Observable<{sprint: string, timeSpent: number}[]> {
    return this.store.pipe(
      select(featureSelector),
      map(state => state.issues),
      distinctUntilChanged(),
      map(issues => {
        if (projectType == undefined) {
          return issues
        } 
        return issues.filter(i => i.projectType == projectType)
      }),
      map(issues => {
        const expandedData = issues.flatMap(issue => {
          const timeSpent = issue.timeSpent || 0
          const timeSpentBySprint = issue.sprints.length == 0? 0: timeSpent / issue.sprints.length
          return issue.sprints.map(sprint => ({sprint, timeSpent: timeSpentBySprint}))
        })
        return expandedData.reduce((a,b)=> {
            const oldElement = a.find(item => item.sprint == b.sprint) || {sprint: b.sprint, timeSpent:0}
            const restList = a.filter(item => item.sprint != b.sprint)
            return [...restList, {...oldElement, timeSpent: oldElement.timeSpent + b.timeSpent}] 
        },<{sprint: string, timeSpent:number}[]>[]) || []}
      ),
      distinctUntilChanged()
    )
  }
}
