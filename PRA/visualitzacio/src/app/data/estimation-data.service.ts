import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, map, distinctUntilChanged, withLatestFrom } from 'rxjs';
import { featureSelector } from './selector';
import { SummaryDataService } from './summary-data.service';
import { InternalProjectsGraphicDataService } from './internal-projects-graphic-data.service'

@Injectable({
  providedIn: 'root'
})
export class EstimationDataService {

  constructor(private readonly store: Store, 
    private readonly summaryDataService: SummaryDataService,
    private readonly internalProjectsGraphicDataService: InternalProjectsGraphicDataService) { }

  getDataForEstimation():Observable<{project:string, estimated:number, timeSpent:number, issueType:string, diff:number}[]>{
    return this.store.pipe(
      select(featureSelector),
      map(state => state.issues),
      distinctUntilChanged(),
      map(data => data
        .filter(i=>i.projectType =='INTERN')
        .filter(i=>i.originalEstimate !=0)
        .map(i => ({project: i.project, estimated: i.originalEstimate, timeSpent: i.timeSpent, issueType: i.issueType}))
        .map(i => ({...i, diff: i.timeSpent - i.estimated}))
        .filter(i => i.estimated != null && i.estimated!=undefined)),
      withLatestFrom(this.summaryDataService.getSummaryForAllProjects(), this.internalProjectsGraphicDataService.getProjects()),
      map(([data, summaries, projects])=> {
        const projectWithSummary = summaries.map((v,i)=> ({data:v, project: projects[i]}))
        projectWithSummary.sort((a,b)=> b.data.sum-a.data.sum)
        const top = projectWithSummary.slice(0,1).map(i=>i.project).find(i=>true)
        return data.filter(i=>i.project==top)
      }),
      map(data => {
        console.log(data)
        return data
      })
    )
  }

}
