import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { interpolateSinebow, max, scaleBand, scaleLinear, scaleOrdinal, scaleSequential, schemeAccent, select, stack } from 'd3';
import { combineLatest, fromEvent, map, Observable, ReplaySubject, startWith, Subject } from 'rxjs';
import { AllDataService } from 'src/app/data/all-data.service';
import { InternalProjectsGraphicDataService } from 'src/app/data/internal-projects-graphic-data.service';
import { SelectedSprintService } from 'src/app/data/selected-sprint.service';

@Component({
  selector: 'app-internal-components-graphic',
  templateUrl: './internal-components-graphic.component.html',
  styleUrls: ['./internal-components-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalComponentsGraphicComponent implements AfterViewInit {

  @Input()
  tabChange!: Observable<number>

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

  @ViewChild('internalgraphic') elementRef!: ElementRef
  constructor( 
    private readonly internalProjectsGraphicDataService: InternalProjectsGraphicDataService,
    private readonly selectedSprintsService: SelectedSprintService,
    private readonly allDataService: AllDataService) { }

  ngAfterViewInit(): void {
     combineLatest([this.internalProjectsGraphicDataService.getData(),
                    this.internalProjectsGraphicDataService.getProjects(),
                    this.selectedSprintsService.getSelectedSprints(),
                    this.allDataService.getAllSortedSprints(),
                    this.relativeObs.pipe(map(v=> v.relative), startWith(false)),
                   fromEvent(window, 'resize').pipe(startWith(true)),
                   this.tabChange

                  ])
      .subscribe(([data, projects, selectedSprints, allSprints, relative, _, tab])=>{
         this.updateSize();
         if (tab != 1) {
           this.delete();
           return
         }
         if (selectedSprints.length ==0) {
          this.draw(data, projects, allSprints, relative);
         } else {
          this.draw(data, projects, selectedSprints, relative);
         }
      })
  }

  private getTotal(i:{sprint: string, totalTimeSpent: number, timeSpent: {[key:string]: number}}):number{
    return i.totalTimeSpent
  }
  delete():void {
    select('.internal-projects-graphic').selectAll('g').remove()
  }

  draw(data: {sprint: string, totalTimeSpent:number, timeSpent: {[key:string]: number}}[], projects: string[], selectedSprints: string[], relative: boolean): void {
    const svg = select('.internal-projects-graphic')

    const scaleX = scaleBand().range([0, this.plotWidth]).domain(selectedSprints).padding(0);
    const scaleY = scaleLinear().range([0, this.plotHeight]).domain([0, max(data, i=> relative? 1: this.getTotal(i)) || 0])
    const scale = scaleSequential(interpolateSinebow).domain([0, projects.length])

    const stackedData = stack().keys(projects).value((obj, key) => {
      const total = this.getTotal(<any>obj)
      const value = (<any>obj['timeSpent'])[key] || 0
      if (relative) {
          if (total == 0) {
            return 0
          }
          return value / total
      }
      return value
    })(<any>data)


    svg.selectAll('g').remove()

    const g = svg.append('g')
      .selectAll('g')
      .data(stackedData)

      g
      .join('g')
      .attr('fill', d=> scale(projects.indexOf(d.key)))
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
