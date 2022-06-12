import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { scaleOrdinal, ScaleOrdinal, schemeAccent } from 'd3';
import { distinctUntilChanged, filter, map, Observable, shareReplay, startWith } from 'rxjs';
import { FilterService } from 'src/app/data/filter.service';
import { ProjectTypeGraphicDataService } from 'src/app/data/project-type-graphic-data.service';

@Component({
  selector: 'app-filter-project-type-card',
  templateUrl: './filter-project-type-card.component.html',
  styleUrls: ['./filter-project-type-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterProjectTypeCardComponent {

  scaleColor: any

  constructor(
    private readonly projectTypeGraphicDataService: ProjectTypeGraphicDataService,
    private readonly filterService: FilterService) {

   }

  getColor(projectType:string):Observable<string> {
    return this.projectTypeGraphicDataService.getProjectTypes().pipe(
      filter(projectType => projectType.length !=0), 
      distinctUntilChanged(),
      map(projectTypes => scaleOrdinal(schemeAccent).domain(projectTypes)),
      map(scaler => scaler(projectType)),
      shareReplay()
    )
  }

  getValue(projectType: string): Observable<string> {
    return this.filterService.getFilter('projectType').pipe(
      map(filter => filter[projectType]),
      map(bool => !!bool),
      map(bool => bool +'')
    )
  }

  toggle(projectType: string): void {
    this.filterService.toggleFilter('projectType', projectType)
  }
  

}
