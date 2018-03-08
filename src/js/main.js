require("./lib/social"); //Do not delete
var d3 = require('d3');

$('a[href^="http"]').attr('target','_blank');

// colors for bubble graph
var bar_spacing = 20;

var formatthousands = d3.format(",");

var windowWidth = $(window).width();

var margin = {
  top: 15,
  right: 15,
  bottom: 130,
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
  document.querySelector(".age").innerHTML = `<strong>${season}</strong>`;
};

var ages = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41];
var i = 0;

var loop = null;
var tickTime = function() {
  drawBars(ages[i]);
  updateInfo(ages[i]);
  i = (i + 1) % ages.length;
  if (i == 11 || i == 0){
    loop = setTimeout(tickTime, 10000);
  } else {
    loop = setTimeout(tickTime, 1000);
  }
};

tickTime();

var svg, x, y;

var threes_tooltip = d3.select("body")
   .append("div")
   .attr("class","threes_tooltip")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("display", "none")

function drawBars(selectedAge) {

  var barData = threesData.filter(function(data) { return data.Age == selectedAge });
  var barDataThrees = threesData.slice();

  if (i == 0) {

     d3.select("#threes-chart").select("svg").remove();

     // show tooltip

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
        if (d.Player == "Stephen Curry*" && selectedAge > 29){
          return "#EFA329";//"#64B5F0";
        } else {
          return "#F2C724";//"#3182bd";
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
      .on("mouseover", function(d) {
        if (d.Player == "Stephen Curry*" && selectedAge > 29){
          threes_tooltip.html(`
            <div><b>${d.Player}</b></div>
            <div>Age: <b>${d.Age}</b></div>
            <div>Projected three-pointers: <b>${formatthousands(d.value)}</b></div>
          `);
        } else {
          threes_tooltip.html(`
            <div><b>${d.Player}</b></div>
            <div>Age: <b>${d.Age}</b></div>
            <div>Three-pointers made: <b>${formatthousands(d.value)}</b></div>
          `);
        }
        threes_tooltip.style("display", "block");
      })
      .on("mousemove", function(d) {
        if (screen.width <= 480) {
          return threes_tooltip
            .style("top", (d3.event.pageY+20)+"px")
            .style("left",function(){
              if (d3.event.pageX > 250){
                return (d3.event.pageX-80)+"px";
              } else {
                return (d3.event.pageX-20)+"px";
              }
            });
        } else {
          return threes_tooltip
            .style("top", (d3.event.pageY+20)+"px")
            .style("left",(d3.event.pageX-80)+"px");
        }
      })
      .on("mouseout", function(){return threes_tooltip.style("display", "none");})
      .transition()
      .duration(100)
      .attr("height", function(d) {
        if (d.Player == "Stephen Curry*" && selectedAge > 29){
          return y(2126) - y(d.value);
        } else {
          return height - y(d.value);
        }
      });

}


