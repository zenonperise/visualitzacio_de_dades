import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { AllDataService } from 'src/app/data/all-data.service';
import { scaleLinear, select, max,min, selectAll, scaleBand,  } from 'd3';
import { combineLatest, delay, fromEvent, Observable, startWith } from 'rxjs';
import { SelectedSprintService } from 'src/app/data/selected-sprint.service';

@Component({
  selector: 'app-general-graphic',
  templateUrl: './general-graphic.component.html',
  styleUrls: ['./general-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralGraphicComponent implements OnInit {

  @Input()
  tag!:string
  @Input()
  tabChange!: Observable<number>
  @Input()
  projectType!: string

  width: number = 200
  height: number = 200
  margin = {
    top: 0,
    bottom: 50,
    right: 50,
    left: 50
  }
  plotHeight:number = 0;
  plotWidth:number = 0;

  selectedSprint: string = ''

  constructor(private readonly allDataService: AllDataService, 
    private readonly elementRef: ElementRef,
    private readonly selectedSprintService: SelectedSprintService) { }
  
  ngOnInit(): void {
    combineLatest([this.allDataService.getAllDataSprintTimeSpent(this.projectType), 
                   this.allDataService.getAllSortedSprints(),
                   this.selectedSprintService.getSelectedSprints(),
                   fromEvent(window, 'resize').pipe(startWith(true)), 
                   this.tabChange
                  ])
      .subscribe(([data, sprints, selectedSprints])=>{
         this.updateSize();
         this.draw(data, sprints, selectedSprints);
      })
  }

  private draw(data: {sprint: string, timeSpent: number}[], sprints: string[], selectedSprints: string[]):void {
    const svg = select('.'+this.tag)

    const scaleX = scaleBand().range([0, this.plotWidth]).domain(sprints).padding(0);
    const scaleY = scaleLinear().range([0, this.plotHeight]).domain([0, max(data, i=> i.timeSpent) || 0])
  
    const bars = svg.selectAll('rect').data(data)

    bars.enter()
      .append('rect')
      .merge(<any> bars)
      .attr('class', this.tag+'-bar')
      .attr("x", (d) => { return scaleX(d.sprint)||0; })
      .attr("y", (d) => {
        return this.plotHeight -scaleY(d.timeSpent); })
      .attr("width", scaleX.bandwidth())
      .attr("height", (d) => { return  scaleY(d.timeSpent); })
      .attr('fill', '#3f51b5')
      .attr('fill-opacity', d=> selectedSprints.indexOf(d.sprint)==-1?'30%':'100%')
      .attr('id', d => d.sprint.replace(' ', '_'))
      .on('mouseover', (e, d) => this.setOpacity(e, d.sprint, '100%', sprints, selectedSprints, '100%'))
      .on('mouseout', (e, d) => this.setOpacity(e, d.sprint, '30%', sprints, selectedSprints, '100%'))
      .on('click', (e, d) => {this.clicked(e, d.sprint, selectedSprints.length !=0)})
    bars.exit().remove()
  }

  public setOpacity(event:any, sprint: string, opacity: string, sprints: string[], selectedSprints: string[], opacitySelected: string){
    if (this.selectedSprint == '') {
      select(event.currentTarget).attr('fill-opacity', selectedSprints.indexOf(sprint)==-1?opacity: opacitySelected)
    } else {
      this.selectedSprintService.calculateSelectedSprints(sprints, sprint, this.selectedSprint)
        .map(s => s.replace(' ', '_'))
        .forEach(s => 
          selectAll('#'+s).attr('fill-opacity', opacity)
        )
    }
  }

  public clicked(event: MouseEvent, sprint: string, selectedSprints: boolean):void {
    event.preventDefault();
    event.stopPropagation();
    if (selectedSprints) {
      this.selectedSprintService.resetSelectedSprints()
    } else  if (this.selectedSprint == '') {
      this.selectedSprint = sprint;
    } else {
      this.selectedSprintService.setSelectedSprints(this.selectedSprint, sprint)
      this.selectedSprint = ''
    }
  }

  @HostListener('click')
  @HostListener('blur')
  public resetSelectedSprint(): void {
    this.selectedSprint = ''
  }

  updateSize():void {
    this.width = this.elementRef.nativeElement.offsetWidth
    this.height = this.elementRef.nativeElement.offsetHeight

    this.plotWidth = this.width - this.margin.left - this.margin.right
    this.plotHeight = this.height - this.margin.top - this.margin.bottom
  }

}
