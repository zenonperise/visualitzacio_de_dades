import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { combineLatest, distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { AllDataService } from 'src/app/data/all-data.service';
import { SelectedSprintService } from 'src/app/data/selected-sprint.service';
import { SummaryDataService, SummaryLine } from 'src/app/data/summary-data.service';

@Component({
  selector: 'app-selected-sprints-card',
  templateUrl: './selected-sprints-card.component.html',
  styleUrls: ['./selected-sprints-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedSprintsCardComponent {

  @Input()
  mode!:'projectType'|'project'

  @Input()
  count:'all'|number = 'all'

  constructor(private readonly selectedSprintsService: SelectedSprintService,
              private readonly allDataService: AllDataService,
              private readonly summaryDataService: SummaryDataService) { }

  get totalProjectType():Observable<SummaryLine> {
    return this.summaryDataService.getTotalForProjectTypes().pipe(
      filter(i => this.mode ==='projectType'))
  }
  
  get totalProject():Observable<SummaryLine> {
    return this.summaryDataService.getTotalForProjects().pipe(
      filter(i => this.mode === 'project')
    )
  }

  get summaryByProjectTypes():Observable<SummaryLine[]> {
    return this.summaryDataService.getSummaryForProjectTypes().pipe(
      filter(i => this.mode ==='projectType'))
  }
  get summaryByProjects():Observable<SummaryLine[]> {
    return this.summaryDataService.getSummaryForProjects().pipe(
      filter(i => this.mode ==='project'),
      map(data => {
        if (typeof this.count == 'number') {
          const res = [...data]
          res.sort((a,b)=> b.sum-a.sum)
          return res.slice(0, this.count)
        }
        return data
      }))
  }
  get summaryByProjectsAll():Observable<SummaryLine[]> {
    return this.summaryDataService.getSummaryForProjects().pipe(
      filter(i => this.mode ==='project'),
      map(data => {
        if (typeof this.count == 'number') {
          const res = [...data]
          res.sort((a,b)=> b.sum-a.sum)
          return res
        }
        return data
      }))
  }

  get selectedSprints(): Observable<string> {
    return combineLatest([this.selectedSprintsService.getSelectedSprints(),
                          this.allDataService.getAllSortedSprints()])
      .pipe(
        map(([selected, all])=> {
          if (selected.length == 0) {
            return all
          }
          return selected
        }),
        map(sprints => {
          if (sprints.length ==0) {
            return ''
          }
          return sprints[0] + ' - ' + sprints[sprints.length -1] + ' ('+sprints.length+' Sprints)'
        }),
        distinctUntilChanged()
    )
  }

}

