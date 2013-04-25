/*

  this is the main panel view

  the main element is the svg

  statistics are calculated by passing values to the server via JSON format


//TODO datafunctions need some clean up

*/



$(document).ready(function () {


    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {
            toggleFullScreen();
        }

    }, false);


    //start with a black container

    resetContainer();


});



var svgContainer;

var xscale, yscale;

var startX, startY, endX, endY;

var mxpos = 0;
var mypos = 1;

var xpos_label;

var selectBox;

var mouse_pressed = false;

var circles;

var selected_circles;
var all_xy = [];
var selected_xy = [];


var circlecolor = d3.rgb(0, 0, 80);
var selectcolor = d3.rgb(50, 150, 255);

var selectbox_color = d3.rgb(50, 50, 50);

//svg sizes
var w = 700;
var h = 600;


function makelinear(circledata, xoff, yoff, xvel, yvel) {
    //create some linear data

    for (var i = 0; i < 10; i++) {
        var x = i * xvel + xoff;
        var y = i * yvel + yoff;
        if (x < w) {
            d = {
                "x": x,
                "y": y,
            };
            circledata.push(d);
        }
    }

    return circledata;
}

function linearData() {

    var circledata = [];

    circledata = makelinear(circledata, 20, 20, 60, 50);

    return circledata;

}



function gaussianData() {
    // client side for now

    var circleData = [];

    var gauss = science.stats.distribution.gaussian();

    var xoff = 30;
    var yoff = 20;
    var xvel = 60;
    var yvel = 50;
    for (var i = 0; i < 40; i++) {

        var j = (i - 20) / 4;
        var x = j * 70 + 350;
        var y = gauss.pdf(j);

        if ((x < w) && (y < h)) {

            d = {
                "x": x,
                "y": y,
            };

            circleData.push(d);
        }
    }

    return circleData;

}



function drawBox(svgContainer) {

    // borders of the svg box

    var left = svgContainer.append("rect").attr("width", 1).attr("height", h)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var right = svgContainer.append("rect").attr("width", 1).attr("height", h)
        .attr("x", w - 2).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var top = svgContainer.append("rect").attr("width", w).attr("height", 1)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var down = svgContainer.append("rect").attr("width", w).attr("height", 1)
        .attr("x", 0).attr("y", h - 2).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);


    //selection box
    var box = svgContainer.append("rect").attr("width", w).attr("height", h)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 0.00);

}


function resetContainer() {
    /*create new svg element , just to be safe */

    var main = d3.select('body').select('#graph');

    main.select("svg")
        .remove();

    svgContainer = main.append("svg").attr("width", w).attr("height", h)

    drawBox(svgContainer);

}

function customAxis() {
    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(yscale).ticks(4).orient("left");
    // Add the y-axis to the left
    svgContainer.append("svg:g")
        .attr("class", "y axis axisLeft")
        .attr("transform", "translate(45,0)")
        .call(yAxisLeft);

    var xAxis = d3.svg.axis().scale(xscale).tickSize(10).tickSubdivide(true);
    // Add the x-axis.
    svgContainer.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 580 + ")")
        .call(xAxis);


    svgContainer.append("text") // text label for the x axis
    .attr("x", 265)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("font-size", "1.3em")
        .text("Groesse");


    svgContainer.append("text") // text label for the x axis
    .attr("x", 140)
        .attr("y", 400)
        .style("text-anchor", "middle")
        .style("font-size", "1.3em")
        .text("Untersuchungszeit");
}

function drawPlot(circleData) {


    resetContainer();
    resetInfo();

    xpos_label = d3.select('body').select('#xpos');

    var maxx = d3.max($.map(circleData, function (d) {
        return d.x;
    }));
    var minx = d3.min($.map(circleData, function (d) {
        return d.x;
    }));
    var maxy = d3.max($.map(circleData, function (d) {
        return d.y;
    }));
    var miny = d3.min($.map(circleData, function (d) {
        return d.y;
    }));


    var sideoffset = 20;
    xscale = d3.scale.linear().domain([minx, maxx]).range([sideoffset, w - sideoffset]);

    yscale = d3.scale.linear().domain([miny, maxy]).range([h - sideoffset, sideoffset]);




    var box = svgContainer.append("rect").attr("width", w).attr("height", h)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 0.00);

    var fixedradius = 10.0;

    circles = svgContainer.selectAll("circle")
        .data(circleData)
        .enter()
        .append("circle");


    var circleAttributes = circles
        .attr("cx", function (d) {
        return xscale(d.x);
    })
        .attr("cy", function (d) {
        return yscale(d.y);
    })
        .attr("r", function (d) {
        return fixedradius;
    })
        .style("fill", function (d) {
        return circlecolor;
    });


    //Add some text (not used)
    /*
      var text = svgContainer.selectAll("text")
                              .data(circleData)
                             .enter()
                             .append("text");//Add SVG Text Element Attributes


       
      var textLabels = text
                      .attr("x", function(d) { return d.cx; })
                     .attr("y", function(d) { return d.cy; })
                     .text( function (d) { return "( " + d.cx + ", " + d.cy +" )"; })
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "15px")
                     .attr("fill", "steelblue");
      */


    svgContainer.on('mousemove', move)
        .on('mousedown', mdown)
        .on("mouseup", up);

    selectBox = svgContainer.append("rect").attr("width", 100).attr("height", 100)
        .attr("x", 100).attr("y", 100).attr("fill", selectbox_color).attr("fill-opacity", 0.08);


    all_xy = [];

    circles.select(function (d, i) {
        all_xy.push(d);
    });




    // here we pass data to the server


    var a = 0;
    var b = 0;


    // call the server with selected data
    
    $.post("/stat/regression/", {
        vals: JSON.stringify(all_xy)
    }, function (data) {

        var resultDict = jQuery.parseJSON(data);        

        d3.select('#x_avgstat').text(Math.round(resultDict["avgx"]));
        
        d3.select('#y_avgstat').text(Math.round(resultDict["avgy"]));

        d3.select('#slope_all').text(resultDict["slope"]);

        d3.select('#std_err_all').text(resultDict["std_err"]);

        d3.select('#r_value_all').text(resultDict["r_value"]);

        //d3.select('#y_medianstat').text("median y: " + data);
        //d3.select('#x_medianstat').text("median x: " + data);



        a = resultDict["intercept"];
        b = resultDict["slope"];



        //The data for our line
        var reglineX1 = minx;
        var reglineY1 = minx * b + a;

        var reglineX2 = maxx;
        var reglineY2 = maxx * b + a;

        var lineData = [{
                "x": reglineX1,
                "y": reglineY1
            }, {
                "x": reglineX2,
                "y": reglineY2
            }
        ];

        
        var lineFunction = d3.svg.line()
            .x(function (d) {
            return xscale(d.x);
        })
            .y(function (d) {
            return yscale(d.y);
        })
            .interpolate("linear");


        
        var lineGraph = svgContainer.append("path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none");



    });
    


}



function mdown() {
    //if mouse is down

    startmouse = d3.mouse(this);

    mouse_pressed = true;

    startX = d3.mouse(this)[mxpos];
    startY = d3.mouse(this)[mypos];

    d3.select('#downflag').text("down  " + "x : " + Math.round(startX) + " y: " + Math.round(startY));


    d3.select('#info').attr("x", 50);
}



function move() {
    // if mouse is moved select elements 


    var curX = d3.mouse(this)[mxpos];
    var curY = d3.mouse(this)[mypos];

    d3.select('#xpos').text("x : " + Math.round(curX) + " y: " + Math.round(curY));


    if (mouse_pressed) {

        // only brush if mouse is down

        // custom brush function
        // (d3 has it's own brush which is not used here)


        //set min and max

        var minx = startX < curX ? startX : curX;
        var maxx = startX < curX ? curX : startX;
        var miny = startY < curY ? startY : curY;
        var maxy = startY < curY ? curY : startY;


        //paint the selection box
        selectBox.attr("width", maxx - minx);
        selectBox.attr("x", minx);
        selectBox.attr("y", miny);
        selectBox.attr("height", maxy - miny);


        //fill all with init color   
        circles.style("fill", circlecolor);


        var minx = startX < curX ? startX : curX;
        var maxx = startX < curX ? curX : startX;
        var miny = startY < curY ? startY : curY;
        var maxy = startY < curY ? curY : startY;

        highlightCircles(minx,maxx,miny,maxy);
    }

}


function highlightCircles(minx,maxx,miny,maxy){

    // select based on x y scaled coordinates
    // map data to mouse coords and compare those to actual mouse movements
    selected_circles = circles.select(function (d, i) {

        var hit = xscale(d["x"]) > minx && xscale(d["x"]) < maxx && yscale(d["y"]) > miny && yscale(d["y"]) < (maxy);

        return hit ? this : null;
    });


    selected_xy = [];

    // mark the selection with color
    selected_circles.style("fill", selectcolor);


    selected_circles.each(function (d, i) {
        selected_xy.push(d);
    });
    

}

function highlightAverage(){
        // select based on x y scaled coordinates
    // map data to mouse coords and compare those to actual mouse movements

   var sumx = d3.sum($.map(all_xy, function (d) {
        return d.x;
    }));

   var avgx = sumx / all_xy.length;
    
   var sumy = d3.sum($.map(all_xy, function (d) {
        return d.y;
    }));

   var avgy = sumy / all_xy.length;

   var maxx = d3.max($.map(all_xy, function (d) {
        return d.x;
    }));
    var minx = d3.min($.map(all_xy, function (d) {
        return d.x;
    }));
    var maxy = d3.max($.map(all_xy, function (d) {
        return d.y;
    }));
    var miny = d3.min($.map(all_xy, function (d) {
        return d.y;
    }));

   //remove

   graphLine((avgx),(miny),(avgx),(maxy), "blue", "havg");
    graphLine((minx),(avgy),(maxx),(avgy), "blue", "havg");



}

function randomHist(){

    var n = 1000, // number of trials
    m = 10,    // number of random variables
    data = [];

    // Generate an Irwin-Hall distribution.
    for (var i = 0; i < n; i++) {
      for (var s = 0, j = 0; j < m; j++) {
        s += Math.random();
      }
      data.push(s);
    }

    var histogram = d3.layout.histogram()
        (data);


    var x = d3.scale.ordinal()
        .domain(histogram.map(function(d) { return d.x; }))
        .rangeRoundBands([0, w]);

    var y = d3.scale.linear()
        .domain([0, d3.max(histogram.map(function(d) { return d.y; }))])
        .range([0, h]);


    svgContainer.selectAll("rect")
        .data(histogram)
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return h - y(d.y); })
        .attr("height", function(d) { return y(d.y); })
        .attr("fill", "steelblue");



}

function plotFaithFul(){
    resetContainer();

    // Based on http://bl.ocks.org/900762 by John Firebaugh
d3.json("/static/faithful.json", function(faithful) {

    data = faithful;

    var circleData = [];
    for (var i = 0; i < data.length; i++) {

            d = {
                "x": i,
                "y": data[i],
            };

            circleData.push(d);
        
    }

    drawPlot(circleData);

  
      var x = d3.scale.linear().domain([30, 110]).range([0, w]);
      bins = d3.layout.histogram().frequency(false).bins(x.ticks(50))(data),
      max = d3.max(bins, function(d) { return d.y; }),
      y = d3.scale.linear().domain([0, .1]).range([0, h]),
      kde = science.stats.kde().sample(data);


  
  var bars = svgContainer.selectAll("g.bar")
      .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {
        return "translate(" + x(d.x) + "," + (h - y(d.y)) + ")";
      }

      );


  bars.append("rect")
      .attr("fill", "steelblue")
      .attr("width", function(d) { return x(d.dx + 30) - 1; })
      .attr("height", function(d) { return y(d.y); });
 

/*
//kde kernel

  var line = d3.svg.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return h - y(d[1]); });

  svgContainer.selectAll("path")
      .data(d3.values(science.stats.bandwidth))
    .enter().append("path")
      .attr("d", function(h) {
        return line(kde.bandwidth(h)(d3.range(10, 200, .3)));        
      })
      .fillStyle("#aaa");
*/    

});
}


function up() {
    // mouse up
    // calc statistics

    mouse_pressed = false;

    var curX = Math.round(d3.mouse(this)[mxpos], 3);
    var curY = Math.round(d3.mouse(this)[mypos], 3);

    var deltax = Math.round(curX - startX, 3);
    var deltay = Math.round(curY - startY, 3);


   var maxx = d3.max($.map(selected_xy, function (d) {
        return d.x;
    }));
    var minx = d3.min($.map(selected_xy, function (d) {
        return d.x;
    }));
    var maxy = d3.max($.map(selected_xy, function (d) {
        return d.y;
    }));
    var miny = d3.min($.map(selected_xy, function (d) {
        return d.y;
    }));

    // call the server with selected data
    $.post("/stat/regression/", {
        vals: JSON.stringify(selected_xy)
    }, function (data) {

        var resultDict = jQuery.parseJSON(data);        

        d3.select('#x_avgstat').text("" + Math.round(resultDict["avgx"]));
        
        d3.select('#y_avgstat').text("" + Math.round(resultDict["avgy"]));

        d3.select('#slope_selected').text(resultDict["slope"]);

        d3.select('#std_err_selected').text(resultDict["std_err"]);

        d3.select('#r_value_selected').text(resultDict["r_value"]);

        //d3.select('#y_medianstat').text("median y: " + data);
        //d3.select('#x_medianstat').text("median x: " + data);


        //paint selected regression line in green

        a = resultDict["intercept"];
        b = resultDict["slope"];

        var reglineX1 = minx;
        var reglineY1 = minx * b + a;

        var reglineX2 = maxx;
        var reglineY2 = maxx * b + a;

        svgContainer.select('#selectedregline').remove();
        graphLine(reglineX1,reglineY1,reglineX2,reglineY2, "green","selectedregline");

    });




    d3.select('#count').text(selected_xy.length);


    d3.select('#upflag').text("up  " + "x : " + curY + " y: " + curY);
    d3.select('#deltax').text("delta x " + deltax);
    d3.select('#deltay').text("delta y " + deltay);

    selectBox.attr("width", 0);
    selectBox.attr("height", 0);



    //setTimeout(resetInfo, 1000);
}

function graphLine(x1,y1,x2,y2,color,id){
       var lineData = [{
                "x": x1,
                "y": y1
            }, {
                "x": x2,
                "y": y2
            }
        ];
      
        var lineFunction = d3.svg.line()
            .x(function (d) {
            return xscale(d.x);
        })
            .y(function (d) {
            return yscale(d.y);
        })
            .interpolate("linear");

      
        var lineGraph = svgContainer.append("path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("id",id);   

}

function resetInfo() {
    d3.select('#upflag').text("");
    d3.select('#downflag').text("");
    d3.select('#deltax').text("");
    d3.select('#deltay').text("");

    d3.select('#slope_selected').text("");

    d3.select('#std_err_selected').text("");

    d3.select('#r_value_selected').text("");
}



function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}


/*
// client side random data
function randomData() {


    var circleData = [];


    var xoff = 30;
    var yoff = 20;
    var xvel = 60;
    var yvel = 50;
    for (var i = 0; i < 20; i++) {

        var x = (Math.random() * (w - 20)) + 20;
        var y = (Math.random() * (h - 20)) + 20;
        if ((x < w) && (y < h)) {

            d = {
                "x": x,
                "y": y,
            };

            circleData.push(d);
        }
    }

    return circleData;

}
*/


function kde(sample) {
  /* Epanechnikov kernel */
  function epanechnikov(u) {
    return Math.abs(u) <= 1 ? 0.75 * (1 - u*u) : 0;
  };

  var kernel = epanechnikov;
  return {
    scale: function(h) {
      kernel = function (u) { return epanechnikov(u / h) / h; };
      return this;
    },

    points: function(points) {
      return points.map(function(x) {
        var y = pv.sum(sample.map(function (v) {

          return kernel(x - v);

        })) / sample.length;
        return {x: x, y: y};
      });
    }
  }
}

