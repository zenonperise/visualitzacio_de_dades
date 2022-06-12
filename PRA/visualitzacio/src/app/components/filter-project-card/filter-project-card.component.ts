import { Component, Input, OnInit, ɵɵngDeclareClassMetadata } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { interpolateSinebow, scaleOrdinal, scaleSequential, schemeAccent } from 'd3';
import { combineLatest, distinctUntilChanged, filter, map, Observable, shareReplay } from 'rxjs';
import { FilterService } from 'src/app/data/filter.service';
import { InternalProjectsGraphicDataService } from 'src/app/data/internal-projects-graphic-data.service';
import { SelectedSprintService } from 'src/app/data/selected-sprint.service';
import { featureSelector } from 'src/app/data/selector';
import { SummaryDataService } from 'src/app/data/summary-data.service';

@Component({
  selector: 'app-filter-project-card',
  templateUrl: './filter-project-card.component.html',
  styleUrls: ['./filter-project-card.component.scss']
})
export class FilterProjectCardComponent {

  @Input()
  count = 5

  constructor(private readonly internalProjectsGraphicDataService: InternalProjectsGraphicDataService,
            private readonly filterService: FilterService,
            private readonly summaryDataService: SummaryDataService) { }


  getColor(project:string):Observable<string> {
    return this.internalProjectsGraphicDataService.getProjects().pipe(
      filter(projects => projects.length !=0), 
      distinctUntilChanged(),
      map(projects => {
        const scale = scaleSequential(interpolateSinebow).domain([0, projects.length])
        return scale(projects.indexOf(project))
      }),
      shareReplay()
    )
  }

  get allProjects(): Observable<string[]> {
    return this.internalProjectsGraphicDataService.getProjects()
  }

  get topProjects(): Observable<string[]> {
    return combineLatest([this.summaryDataService.getSummaryForAllProjects(),
                    this.internalProjectsGraphicDataService.getProjects()]).pipe(
                  map(([data,projects])=>
                      data.map((v,i)=> ({data:v, project: projects[i]}))
                  ),
                  map(data => {
                    const res = [...data]
                    res.sort((a,b)=> b.data.sum-a.data.sum)
                    return res.slice(0,5).map(i=>i.project)
                  })
    )
  }

  getValue(project: string): Observable<string> {
    return this.filterService.getFilter('project').pipe(
      map(filter => filter[project]),
      map(bool => !!bool),
      map(bool => bool +'')
    )
  }

  toggle(project: string): void {
    this.filterService.toggleFilter('project', project)
  }
  
}
