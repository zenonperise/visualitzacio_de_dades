import { Component, OnInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { AllDataService } from 'src/app/data/all-data.service';
import { EstimationDataService } from 'src/app/data/estimation-data.service';
import { SelectedSprintService } from 'src/app/data/selected-sprint.service';

@Component({
  selector: 'app-estimation-info-card',
  templateUrl: './estimation-info-card.component.html',
  styleUrls: ['./estimation-info-card.component.scss']
})
export class EstimationInfoCardComponent {

  constructor(private readonly selectedSprintsService: SelectedSprintService,
    private readonly allDataService: AllDataService,
    private readonly estimationDataService: EstimationDataService) { }

  get selectedProject(): Observable<string> {
    return this.estimationDataService.getDataForEstimation().pipe(
      map(data => data.map(i => i.project)),
      map(data => [...new Set(data)]),
      map(data => data.join(' '))
    )
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
