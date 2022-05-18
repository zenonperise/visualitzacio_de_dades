var regionHeight = 500
var regionWidth = 700
var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
}
var plotHeight = this.regionHeight - this.margin.top - this.margin.bottom;
var plotWidth = this.regionWidth - this.margin.left - this.margin.right;

var svg = undefined

var scaleX = undefined;
var fullData = []
var scaleColorX = undefined;
var scaleRadius = undefined;

var shownYear = undefined;

var yearList = [1945, 1945, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2016]

dataObs.subscribe(data => {
    svg = d3.select('.infobox').append('svg')
        .attr('height', '' + regionHeight)
        .attr('width', '' + regionWidth)

    scaleX = d3.scaleLinear().range([0, plotWidth]).domain([0, 1])
    scaleRadius = d3.scaleLinear().range([10, 100])
        .domain([d3.min(data, d => d.gdp), d3.max(data, d => d.gdp)])
    scaleColorX = d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 1])
    fullData = data
    svg.append("g")
        .attr('transform', 'translate(' + margin.left + ', ' + (regionHeight/2) + ')')
        .call(d3.axisBottom(scaleX).tickSize(0).tickValues([]))

    show(1945)
    getScrollAction('numbers')
        .pipe(
            rxjs.map(({
                count
            }) => count),
            rxjs.map(count => yearList[count])
        )
        .subscribe(year => {
            show(year)
        })
})

function show(year) {
    if (year == shownYear) {
        return;
    }
    shownYear = year;
    var data = fullData.filter(d => d.year == year).map(d => Object.create(d))

    var circles = svg.selectAll('circle').data(data)
    circles
        .enter()
        .append('circle')
        .merge(circles)
        .attr('class', 'bubbles')
        .attr('r', d => scaleRadius(d.gdp))
        .attr('cx', d => {
            if (isNaN(d.fossilshareenergy)) {
                return margin.left + scaleX(0);
            }
            return margin.left + scaleX(1 - d.fossilshareenergy / 100);
        })
        .attr('cy', margin.top + plotHeight / 2)
        .attr('fill', d => {
            if (isNaN(d.fossilshareenergy)) {
                return scaleColorX(0);
            }
            return scaleColorX(1 - d.fossilshareenergy / 100);
        })
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip)
    circles.exit().remove()

    var nodes = svg.selectAll('circle')
    d3.forceSimulation(data)
        .force('y', d3.forceY(margin.top + plotHeight / 2))
        .force('x', d3.forceX().x(d => {
            if (isNaN(d.fossilshareenergy)) {
                return margin.left + scaleX(0);
            }
            return margin.left + scaleX(1 - d.fossilshareenergy / 100);
        }).strength(2))
        .force('collide', d3.forceCollide().radius(d => scaleRadius(d.gdp)))
        .on('tick', ticked)

    function ticked() {
        nodes.attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }


}


var showTooltip = function (event, d) {
    d3.select('.tooltip')
        .transition()
        .duration(200)
        .style("opacity", 1)
    d3.select('.tooltip_country').html(d.country)
    d3.select('.tooltip_gdp').html('US $ ' + ((d.gdp) / 1000000).toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }) + ' M')
    d3.select('.tooltip_population').html((d.population / 1000000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    }) + ' M')
    d3.select('.tooltip_fossil').html(((isNaN(d.fossilshareenergy) ? 100 : d.fossilshareenergy)).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    }) + '%')
    d3.select('.tooltip_fossil_color')
        .style('background-color', isNaN(d.fossilshareenergy) ? scaleColorX(0): scaleColorX(1-d.fossilshareenergy/100))
    

}

var hideTooltip = function (event, d) {
    d3.select('.tooltip')
        .transition()
        .duration(200)
        .style("opacity", 0)
}