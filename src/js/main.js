require("./lib/social"); //Do not delete
var d3 = require('d3');

// colors for bubble graph
var bar_spacing = 20;

var windowWidth = $(window).width();
console.log("window width = ");
console.log(windowWidth);

var margin = {
  top: 15,
  right: 15,
  bottom: 120,
  left: 80
};
var height, width;
if (screen.width <= 480) {
  margin.left = 50;
  margin.right = 20;
}
// create SVG container for chart components
if (screen.width > 1400){
  height = 700 - margin.top - margin.bottom;
} else if (screen.width >= 340 && screen.width <= 1400){
  height = 500 - margin.top - margin.bottom;
} else if (screen.width <= 480 && screen.width > 340) {
  height = 380 - margin.top - margin.bottom;
} else if (screen.width <= 340) {
  height = 370 - margin.top - margin.bottom;
}
width = Math.min(windowWidth,700) - 10 - margin.left - margin.right;

// fills in HTML for year as years toggle
var updateInfo = function(season) {
  document.querySelector(".info").innerHTML = `<strong>${season}</strong>`;
};

var ages = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38];
var i = 0;

var loop = null;
var tickTime = function() {
  drawBars(ages[i]);
  updateInfo(ages[i]);
  i = (i + 1) % ages.length;
  loop = setTimeout(tickTime, 500);
};

tickTime();

var svg, x, y;

function drawBars(selectedAge) {

  var barData = threesData.filter(function(data) { return data.Age == selectedAge });
  var barDataThrees = threesData.slice();

  console.log(selectedAge);

  if (i == 0) {

	   d3.select("#threes-chart").select("svg").remove();

     svg = d3.select("#threes-chart").append('svg')
       .attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x = d3.scaleTime().range([0, width]);
     x = d3.scaleBand().rangeRound([0, width]).padding(0.05);
     y = d3.scaleLinear().rangeRound([height, 0]);

     // x-axis scale
     x.domain(barData.map(function(d) {
       return d.Player;
     }));
     y.domain([0, 5000]);

     // Add the X Axis
     svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)" )

     // Add the Y Axis
     svg.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("class", "label")
         .attr("transform", "rotate(-90)")
         .attr("y", 0)
         .attr("x", 10)
         .attr("dy", "20px")
         .style("text-anchor", "end")
         .style("fill","black")
         .text("Career threes total");

  }

  barData.forEach(function(d) {
    if (d.Threes){
      d.value = +(d.Threes);
    } else {
      d.value = 0;
    }
  });

  svg.selectAll("bar")
      .data(barData)
    .enter().append("rect")
      .style("fill", function(d){
        if (d.Player == "Stephen Curry" && selectedAge > 30){
          return "#64B5F0";
        } else {
          return "#3182bd";
        }
      })
      .attr("x", function(d) {
        return x(d.Player);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.value);
      })
      .attr("height", 0)
      .transition()
      .duration(100)
      .attr("height", function(d) {
        if (d.Player == "Stephen Curry" && selectedAge > 30){
          return y(2503) - y(d.value);
        } else {
          return height - y(d.value);
        }
      });

}
