import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { deviation, interpolateSinebow, max, mean, min, scaleOrdinal, scaleSequential, schemeAccent, sum } from 'd3';
import { combineLatest, distinctUntilChanged, map, Observable, shareReplay, withLatestFrom } from 'rxjs';
import { SelectedSprintService } from './selected-sprint.service';
import { featureSelector } from './selector';

export interface SummaryLine {
  sum: number,
  avg: number,
  std: number,
  min: number,
  max: number, 
  color: string
}

@Injectable({
  providedIn: 'root'
})
export class SummaryDataService {

  constructor(private readonly selectedSprintService: SelectedSprintService,
    private readonly store: Store) { }

  getTotalForProjectTypes():Observable<SummaryLine> {
    return this.getDataForProjectTypes()
            .pipe(
              map(data => data.map(i => i.timeSpent)),
              map(data => {
                if (data.length == 0) {
                  return {sum: -1, avg: -1, std:-1, min:-1, max:-1, color:'black'}
                }
                return {color:'black', sum: sum(data)||0, avg:mean(data)||0, std:deviation(data)||0, min:min(data)||0, max:max(data)||0}
                }),
              distinctUntilChanged()
          )
  }

  getTotalForProjects():Observable<SummaryLine> {
    return this.getDataForProjects()
            .pipe(
              map(data => data.map(i => i.timeSpent)),
              map(data => {
                if (data.length == 0) {
                  return {sum: -1, avg: -1, std:-1, min:-1, max:-1, color:'black'}
                }
                return {color:'black', sum: sum(data)||0, avg:mean(data)||0, std:deviation(data)||0, min:min(data)||0, max:max(data)||0}
                }),
              distinctUntilChanged()
          )
  }

  getSummaryForProjectTypes():Observable<SummaryLine[]> {
    return this.getDataForProjectTypes().pipe(
      withLatestFrom(this.getColorFunctionForProjectTypes()),
      map(([data, color]) => {
        const projectTypes = [...new Set(data.map(i => i.projectType))]
        projectTypes.sort()
        return projectTypes.map(projectType => {
          const timeSpentArr = data.filter(i => i.projectType == projectType).map(i => i.timeSpent)
          if (timeSpentArr.length == 0) {
            return {sum: -1, avg: -1, std:-1, min:-1, max:-1, color:color(projectType)}
          }
          return {color:color(projectType), sum: sum(timeSpentArr)||0, avg:mean(timeSpentArr)||0, std:deviation(timeSpentArr)||0, min:min(timeSpentArr)||0, max:max(timeSpentArr)||0}    
        })
      })
    )
  }

  getSummaryForProjects():Observable<SummaryLine[]> {
    return this.getDataForProjects().pipe(
      withLatestFrom(this.getColorFunctionForProjects(), this.getInternProjects()),
      map(([data, color, allProjects]) => {
        const projects = [...new Set(data.map(i => i.project))]
        projects.sort()
        return projects.map(project => {
          const timeSpentArr = data.filter(i => i.project == project).map(i => i.timeSpent)
          if (timeSpentArr.length == 0) {
            return {sum: -1, avg: -1, std:-1, min:-1, max:-1, color:color(allProjects.indexOf(project))}
          }
          return {color:color(allProjects.indexOf(project)), sum: sum(timeSpentArr)||0, avg:mean(timeSpentArr)||0, std:deviation(timeSpentArr)||0, min:min(timeSpentArr)||0, max:max(timeSpentArr)||0}    
        })
      })
    )
  }

  getSummaryForAllProjects():Observable<SummaryLine[]> {
    return this.getDataForAllProjects().pipe(
      withLatestFrom(this.getColorFunctionForProjects(), this.getInternProjects()),
      map(([data, color, allProjects]) => {
        const projects = [...new Set(data.map(i => i.project))]
        projects.sort()
        return projects.map(project => {
          const timeSpentArr = data.filter(i => i.project == project).map(i => i.timeSpent)
          if (timeSpentArr.length == 0) {
            return {sum: -1, avg: -1, std:-1, min:-1, max:-1, color:color(allProjects.indexOf(project))}
          }
          return {color:color(allProjects.indexOf(project)), sum: sum(timeSpentArr)||0, avg:mean(timeSpentArr)||0, std:deviation(timeSpentArr)||0, min:min(timeSpentArr)||0, max:max(timeSpentArr)||0}    
        })
      })
    )
  }

  
  getColorFunctionForProjectTypes():Observable<(p:string)=> string> {
    return this.getDataForProjectTypes().pipe(
      map(data => data.map(i=> i.projectType)),
      map(data => [...new Set(data)]),
      map(data => {
        const res = [...data]
        res.sort()
        return res
      }), 
      map(projectTypes => scaleOrdinal(schemeAccent).domain(projectTypes)),
      shareReplay()
    )
  }

  getColorFunctionForProjects():Observable<any> {
    return this.getInternProjects().pipe( 
            map(projects => scaleSequential(interpolateSinebow).domain([0, projects.length])),
            shareReplay()
    )
  }

  getInternProjects(): Observable<string[]>{
    return this.store.pipe(
            select(featureSelector),
            map(state => state.issues),
            map(data => data.filter(i=>i.projectType=='INTERN').map(i=> i.project)),
            map(data => [...new Set(data)]),
            map(data => {
              const res = [...data]
              res.sort()
              return res
            }))
  }

  getDataForProjectTypes(): Observable<{projectType: string, timeSpent:number}[]> {
     return this.getData().pipe(
              map(({data, filter})=> {
                return data.filter(i => !!filter.projectType[i.projectType]).map(i => ({projectType: i.projectType, timeSpent: i.timeSpent}))
              }))
  }

  getDataForAllProjects(): Observable<{project: string, timeSpent:number}[]> {
     return this.getData().pipe(
              map(({data, filter})=> {
                return data.filter(i=>i.projectType=='INTERN')
                  .map(i => ({project: i.project, timeSpent: i.timeSpent}))
              }))
            }
  getDataForProjects(): Observable<{project: string, timeSpent:number}[]> {
     return this.getData().pipe(
              map(({data, filter})=> {
                return data.filter(i=>i.projectType=='INTERN')
                  .filter(i => !!filter.project[i.project])
                  .map(i => ({project: i.project, timeSpent: i.timeSpent}))
              }))
  }

  
  getData() {
    return combineLatest([this.selectedSprintService.getSelectedSprints(),
                          this.store.pipe(
                            select(featureSelector),
                            map(state => state.issues),
                            distinctUntilChanged(),
                            map(issues => issues.flatMap(issue => {
                                const timeSpent = issue.timeSpent || 0
                                const timeSpentBySprint = issue.sprints.length == 0? 0: timeSpent / issue.sprints.length
                                return issue.sprints.map(sprint => ({sprint, project: issue.project, projectType: issue.projectType, timeSpent: timeSpentBySprint}))
                              })
                            )),
                          this.store.pipe(
                            select(featureSelector),
                            map(state => state.filter),
                            distinctUntilChanged()
                          )])
                          .pipe(
              distinctUntilChanged(),
              map(([selectedSprints, data, filter])=> {
                if (selectedSprints.length == 0) {
                  return {data, filter}
                }
                return {data: data.filter(d => selectedSprints.indexOf(d.sprint)!=-1), filter}
              }))
  }
}
