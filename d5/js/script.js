var width = 640;
var height = 480;
var padding = 40;

// the vertical axis is a time scale that runs from 00:00 - 23:59
// the horizontal axis is a time scale that runs from the 2016-01-01 to 2016-12-31

var y = d3.time.scale().domain([new Date(2016, 0, 1), new Date(2016, 0, 1, 23, 59)]).range([0, height]);
var x = d3.time.scale().domain([new Date(2016, 0, 1), new Date(2016, 11, 31)]).range([0, width]);

var monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var mydata;
//When loading data asynchronously, code that depends on the loaded data should generally exist within the callback function.
d3.json("/data/data_SunriseSunsetTwoPlaces.json", function(error, json) {
  if (error) return console.warn(error);
  mydata = json;
//  visualizeit();

//http://www.recursion.org/d3-for-mere-mortals/
    var dayLength = d3.select("#day-length").
      append("svg:svg").
      attr("width", width + padding * 2).
      attr("height", height + padding * 2);

    // create a group to hold the axis-related elements
    var axisGroup = dayLength.append("svg:g").
      attr("transform", "translate("+padding+","+padding+")");
//
// draw the x and y tick marks. Since they are behind the visualization, they
// can be drawn all the way across it. Because the  has been
// translated, they stick out the left side by going negative.
axisGroup.selectAll(".yTicks").
  data(d3.range(5, 22)).
  enter().append("svg:line").
  attr("x1", -5).
  // Round and add 0.5 to fix anti-aliasing effects (see above)
  attr("y1", function(d) { return d3.round(y(new Date(2016, 0, 1, d))) + 0.5; }).
  attr("x2", width+5).
  attr("y2", function(d) { return d3.round(y(new Date(2016, 0, 1, d))) + 0.5; }).
  attr("stroke", "lightgray").
  attr("class", "yTicks");

axisGroup.selectAll(".xTicks").
  data(midMonthDates).
  enter().append("svg:line").
  attr("x1", x).
  attr("y1", -5).
  attr("x2", x).
  attr("y2", height+5).
  attr("stroke", "lightgray").
  attr("class", "yTicks");

// draw the text for the labels. Since it is the same on top and
// bottom, there is probably a cleaner way to do this by copying the
// result and translating it to the opposite side
axisGroup.selectAll("text.xAxisTop").
  data(midMonthDates).
  enter().
  append("svg:text").
  text(function(d, i) { return monthNames[i]; }).
  attr("x", x).
  attr("y", -8).
  attr("text-anchor", "middle").
  attr("class", "axis xAxisTop");

axisGroup.selectAll("text.xAxisBottom").
  data(midMonthDates).
  enter().
  append("svg:text").
  text(function(d, i) { return monthNames[i]; }).
  attr("x", x).
  attr("y", height+15).
  attr("text-anchor", "middle").
  attr("class", "xAxisBottom");

axisGroup.selectAll("text.yAxisLeft").
  data(d3.range(5, 22)).
  enter().
  append("svg:text").
  text(yAxisLabel).
  attr("x", -7).
  attr("y", function(d) { return y(new Date(2016, 0, 1, d)); }).
  attr("dy", "3").
  attr("class", "yAxisLeft").
  attr("text-anchor", "end");

axisGroup.selectAll("text.yAxisRight").
  data(d3.range(5, 22)).
  enter().
  append("svg:text").
  text(yAxisLabel).
  attr("x", width+7).
  attr("y", function(d) { return y(new Date(2016, 0, 1, d)); }).
  attr("dy", "3").
  attr("class", "yAxisRight").
  attr("text-anchor", "start");
//
// create a group for the sunrise and sunset paths
var lineGroup = dayLength.append("svg:g").
  attr("transform", "translate("+ padding + ", " + padding + ")");
//
// draw the background. The part of this that remains uncovered will
// represent the daylight hours.
lineGroup.append("svg:rect").
  attr("x", 0).
  attr("y", 0).
  attr("height", height).
  attr("width", width).
  attr("fill", "lightyellow");
//
// The meat of the visualization is surprisingly simple. sunriseLine
// and sunsetLine are areas (closed svg:path elements) that use the date
// for the x coordinate and sunrise and sunset (respectively) for the y
// coordinate. The sunrise shape is anchored at the top of the chart, and
// sunset area is anchored at the bottom of the chart.
    var sunriseLine = d3.svg.area().
      x(function(d) { return x( new Date(d.utc_datetime) ); }).
      y1(function(d) { dy = moment.tz(d.place1_next_rising, "UTC");
        return y(new Date(dy.tz(mydata._place2.timezone).format("Y"), 0, 1, dy.tz(mydata._place2.timezone).format("h"), dy.tz(mydata._place2.timezone).format("m"))); }).
      interpolate("linear");

    lineGroup.
      append("svg:path").
      attr("d", sunriseLine(mydata.data)).
      style("fill-opacity", 1).
      attr("fill", "steelblue");

    var sunsetLine = d3.svg.area().
      x(function(d) { return x( new Date(d.utc_datetime) ); }).
      y0(height).
      y1(function(d) { dy2 = moment.tz(d.place1_next_setting, "UTC"); 
        return y(new Date(dy2.tz(mydata._place2.timezone).format("Y"), 0, 1, dy2.tz(mydata._place2.timezone).format("H"), dy2.tz(mydata._place2.timezone).format("m"))); }).
      interpolate("linear");

    lineGroup.append("svg:path").
      attr("d", sunsetLine(mydata.data)).
      style("fill-opacity", 1).
      attr("fill", "steelblue");

lineGroup.append("svg:line").
  attr("x1", 0).
  attr("y1", d3.round(y(new Date(2016, 0, 1, 12))) + 0.5).
  attr("x2", width).
  attr("y2", d3.round(y(new Date(2016, 0, 1, 12))) + 0.5).
  attr("stroke", "lightgray");


//moment.tz("2013-11-18 11:55", "America/Toronto");
//mydata._place2.timezone
    var sunriseLine2 = d3.svg.area().
      x(function(d) { return x( new Date(d.utc_datetime) ); }).
      y1(function(d) { dy = moment.tz(d.place2_next_rising, "UTC");
        return y(new Date(dy.tz(mydata._place2.timezone).format("Y"), 0, 1, dy.tz(mydata._place2.timezone).format("h"), dy.tz(mydata._place2.timezone).format("m"))); }).
      interpolate("linear");

    lineGroup.
      append("svg:path").
      attr("d", sunriseLine2(mydata.data)).
      style("fill-opacity", .6).
      attr("fill", "grey");

    var sunsetLine2 = d3.svg.area().
      x(function(d) { return x( new Date(d.utc_datetime) ); }).
      y0(height).
      y1(function(d) { dy2 = moment.tz(d.place2_next_setting, "UTC"); 
        return y(new Date(dy2.tz(mydata._place2.timezone).format("Y"), 0, 1, dy2.tz(mydata._place2.timezone).format("H"), dy2.tz(mydata._place2.timezone).format("m"))); }).
      interpolate("linear");

    lineGroup.append("svg:path").
      attr("d", sunsetLine2(mydata.data)).
      style("fill-opacity", .6).
      attr("fill", "grey");

// finally, draw a line representing 12:00 across the entire
// visualization
lineGroup.append("svg:line").
  attr("x1", 0).
  attr("y1", d3.round(y(new Date(2016, 0, 1, 12))) + 0.5).
  attr("x2", width).
  attr("y2", d3.round(y(new Date(2016, 0, 1, 12))) + 0.5).
  attr("stroke", "lightgray");
//
});


function yAxisLabel(d) {
  if (d == 12) { return "12"; }
  if (d < 12) { return d; }
  return (d );
}

// The labels along the x axis will be positioned on the 15th of the
// month

function midMonthDates() {
  return d3.range(0, 12).map(function(i) { return new Date(2016, i, 15) });
}



//http://techslides.com/save-svg-as-an-image
d3.select("#save").on("click", function(){
  var html = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

  //console.log(html);
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
  var img = '<img src="'+imgsrc+'">'; 
  d3.select("#svgdataurl").html(img);

});