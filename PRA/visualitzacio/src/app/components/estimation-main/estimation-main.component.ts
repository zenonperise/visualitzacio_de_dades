import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { forceCollide, forceSimulation, forceX, forceY, interpolateTurbo, max, min, scaleBand, scaleLinear, scaleSequential, select } from 'd3';
import { combineLatest, fromEvent, Observable, startWith } from 'rxjs';
import { EstimationDataService } from 'src/app/data/estimation-data.service';

@Component({
  selector: 'app-estimation-main',
  templateUrl: './estimation-main.component.html',
  styleUrls: ['./estimation-main.component.scss']
})
export class EstimationMainComponent implements AfterViewInit {

  @Input()
  tabChange!: Observable<number>
  @ViewChild('estimategraphic') elementRef!: ElementRef

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

  constructor(private readonly estimationDataService:EstimationDataService) { }

  ngAfterViewInit(): void {
    combineLatest([this.estimationDataService.getDataForEstimation(),
                  fromEvent(window, 'resize').pipe(startWith(true)),
                  this.tabChange])
            .subscribe(([data])=>{
              this.updateSize()
              this.draw(data)
            })
  }

  private draw(data: {project:string, estimated:number, timeSpent: number, issueType: string, diff: number}[]) {
    const svg = select('.estimate-graphic')

    const scaleY = scaleLinear().domain([min(data, i=>i.diff)||0, max(data, i=>i.diff)||0]).range([40,  this.plotHeight-40])
    const color = scaleSequential(interpolateTurbo).domain([min(data, i=>i.diff)||0, max(data, i=>i.diff)||0])
    const radius = scaleLinear().domain([min(data, i=>i.timeSpent)||0, max(data, i=>i.timeSpent)||0]).range([0, 40])
  
    const circles = svg.selectAll('circle').data(data)

    circles
      .enter()
      .append('circle')
      .merge(<any>circles)
      .attr('r', d=> radius(d.timeSpent))
      .attr('cx', d => this.plotWidth /2)
      .attr('cy', d=>scaleY(d.diff)||0)
      .attr('fill', d => color(d.diff))
    circles.exit().remove()

    forceSimulation(<any>data)
        .force('x', forceX(this.plotWidth/2))
        .force('y', forceY().y(d => scaleY((<any>d).diff)).strength(1.5))
        .force('collide', forceCollide().radius(d => radius((<any>d).timeSpent)))
        .on('tick', ticked)
    const nodes = svg.selectAll('circle')
    function ticked() {
        nodes.attr("cx", d => (<any>d).x)
            .attr("cy", d => (<any>d).y);
    }
  }


  updateSize():void {
    this.width = this.elementRef.nativeElement.offsetWidth 
    this.height = this.elementRef.nativeElement.offsetHeight 

    this.plotWidth = this.width - this.margin.left - this.margin.right
    this.plotHeight = this.height - this.margin.top - this.margin.bottom
  }


}
