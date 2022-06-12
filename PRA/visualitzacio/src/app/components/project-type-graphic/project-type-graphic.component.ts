import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { max, scaleBand, scaleLinear, scaleOrdinal, schemeAccent, select, stack } from 'd3';
import { combineLatest, fromEvent, startWith, map, ReplaySubject, Subject, Observable } from 'rxjs';
import { AllDataService } from 'src/app/data/all-data.service';
import { ProjectTypeGraphicDataService } from 'src/app/data/project-type-graphic-data.service';
import { SelectedSprintService } from 'src/app/data/selected-sprint.service';

@Component({
  selector: 'app-project-type-graphic',
  templateUrl: './project-type-graphic.component.html',
  styleUrls: ['./project-type-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTypeGraphicComponent implements AfterViewInit {

  @Input()
  tabChange!:Observable<number>

  width: number = 200
  height: number = 200
  margin = {
    top: 50,
    bottom: 30,
    right: 50,
    left: 50
  }
  plotHeight:number = 0;
  plotWidth:number = 0;

  relativeObs:Subject<{relative:boolean}> = new ReplaySubject();

  @ViewChild('graphic') elementRef!: ElementRef
  constructor( 
    private readonly projectTypeGraphicDataService: ProjectTypeGraphicDataService,
    private readonly selectedSprintsService: SelectedSprintService,
    private readonly allDataService: AllDataService) { }

  ngAfterViewInit(): void {
     combineLatest([this.projectTypeGraphicDataService.getData(),
                    this.projectTypeGraphicDataService.getProjectTypes(),
                    this.selectedSprintsService.getSelectedSprints(),
                    this.allDataService.getAllSortedSprints(),
                    this.relativeObs.pipe(map(v=> v.relative), startWith(false)),
                   fromEvent(window, 'resize').pipe(startWith(true)),
                   this.tabChange

                  ])
      .subscribe(([data, projectTypes, selectedSprints, allSprints, relative, _, tab])=>{
         this.updateSize();
         if (tab !=0) {
           this.delete();
           return;
         }
         if (selectedSprints.length ==0) {
          this.draw(data, projectTypes, allSprints, relative);
         } else {
          this.draw(data, projectTypes, selectedSprints, relative);
         }
      })
  }

  delete(): void {
    select('.project-type-graphic').selectAll('g').remove()
  }

  draw(data: {sprint: string, timeSpentClient: number, timeSpentIntern:number, timeSpentSupport:number}[], projectTypes: string[], selectedSprints: string[], relative: boolean): void {
    const svg = select('.project-type-graphic')
    
    const scaleX = scaleBand().range([0, this.plotWidth]).domain(selectedSprints).padding(0);
    const scaleY = scaleLinear().range([0, this.plotHeight]).domain([0, max(data, i=> relative? 1: i.timeSpentClient + i.timeSpentIntern + i.timeSpentSupport) || 0])
    const scaleColor = scaleOrdinal(schemeAccent).domain(projectTypes)

    const stackedData = stack().keys(projectTypes).value((obj, key) => {
      const total = obj['timeSpentSupport'] + obj['timeSpentIntern'] + obj['timeSpentClient']
      if (key == 'SUPPORT') {
        const value = obj['timeSpentSupport']
        if (relative) {
          return value / total
        }
        return value
      }
      if (key == 'INTERN') {
        const value = obj['timeSpentIntern']
        if (relative) {
          return value / total
        }
        return value
      }
      if (key == 'CLIENT') {
        const value = obj['timeSpentClient']
        if (relative) {
          return value / total
        }
        return value
      }
      return 0;
    })(<any>data)

    svg.selectAll('g').remove()

    const g = svg.append('g')
      .selectAll('g')
      .data(stackedData)

      g
      .join('g')
      .attr('fill', d=> scaleColor(d.key))
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr("x", d => scaleX(<any>d.data['sprint'])||0)
      .attr("y", d => scaleY(d[0]))
      .attr("height", d =>  scaleY(d[1]- d[0]))
      .attr("width",scaleX.bandwidth())
  }

  updateSize():void {
    this.width = this.elementRef.nativeElement.offsetWidth 
    this.height = this.elementRef.nativeElement.offsetHeight 

    this.plotWidth = this.width - this.margin.left - this.margin.right
    this.plotHeight = this.height - this.margin.top - this.margin.bottom
  }

  public setMode(relative: {relative: boolean}): void {
    this.relativeObs.next(relative)
  }
}
