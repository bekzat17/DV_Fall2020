var margin = 250;
var svg = d3.select("svg");
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;

svg.append("text")
.attr("transform","translate(100,0)")
.attr("x",40)
.attr("y",40)
.attr("class","title")
.text("Russia statistics on suicides from 2011 till 2018");

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height,0]);

var g = svg.append("g");
g.attr("transform","translate(100,180)");

var data = [
  {id: 0, year:2011, work_stress: 14, additictions: 12, social_network: 6},
  {id: 1, year:2012, work_stress: 13, additictions: 11, social_network: 4},
  {id: 2, year:2013, work_stress: 15, additictions: 9, social_network: 3},
  {id: 3, year:2014, work_stress: 16, additictions: 7, social_network: 5},
  {id: 4, year:2015, work_stress: 18, additictions: 6, social_network: 2},
  {id: 5, year:2016, work_stress: 23, additictions: 5, social_network: 3},
  {id: 6, year:2017, work_stress: 25, additictions: 4, social_network: 1},
  {id: 7, year:2018, work_stress: 28, additictions: 2, social_network: 2},
];

xScale.domain(data.map(function(d) { return d.year;}));
yScale.domain([0,d3.max(data, function(d) {
  d.val = d.work_stress +  d.additictions + d.social_network;
  return d.val;})
]);

g.append("g")
.attr("transform","translate(0,"+height+")")
.call(d3.axisBottom(xScale));


g.append("g")
.call(d3.axisLeft(yScale));

function onMouseOver(d,i) {
  d3.select(this)
    .attr('class','highlight');

  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth()+5)
  .attr("y", (d)=>yScale(d.val)-10)
  .attr("height", (d)=>height-yScale(d.val)+10)

  g.selectAll("#info"+i.id)
  .attr("visibility", "visible") //make text with selected id visible

}

function onMouseOut(d,i) {
  d3.select(this)
  .attr('class','bar');
  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth())
  .attr("y", (d)=>yScale(d.val))
  .attr("height", (d)=>height-yScale(d.val));
  g.selectAll('.info')
  .attr("visibility", "hidden") //make all info blocks hidden
  }

g.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class","bar")
.on("mouseover", onMouseOver)
.on("mouseout", onMouseOut)
.attr("x", (d)=>xScale(d.year))
.attr("y", (d)=>yScale(d.val))
.attr("width", xScale.bandwidth())
.transition()
.ease(d3.easeLinear)
.duration(500)
.delay((d,i)=>i*50)
.attr("height", (d)=>height-yScale(d.val));

//block with additional text information
g.selectAll(".info")
  .data(data)
  .enter()
  .append("text")
  .attr("class","info")
  .attr("x", (d)=>(xScale(d.year)+5))
  .attr("y", (d)=>yScale(d.val + 2))
  .attr("transform", (d)=>"rotate(-90, "+(xScale(d.year)+15)+","+yScale(d.val + 2)+")") //rotate it to make vertical
  .attr("visibility", "hidden") //not show before mouse over
  .attr("id", (d)=>"info"+d.id) //generate id to show only text with specific id in function
  .append("tspan")
  .text((d)=>"work_stress:" + d.work_stress + " additictions" +d.additictions+ "social_network:" + d.social_network)
