$(document).ready(function () {



    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {
            toggleFullScreen();
        }

    }, false);

    
    resetContainer();
     
});



var svgContainer;

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


//Width and height
var circlecolor = d3.rgb(0, 0, 80);
var selectcolor = d3.rgb(50, 150, 255);

var selectbox_color = d3.rgb(50, 50, 50);

//svg sizes
var w = 700;
var h = 600;


function linearData() {

    var circleData = [];


    var xoff = 20;
    var yoff = 20;
    var xvel = 60;
    var yvel = 50;
    for (var i = 0; i < 10; i++) {
        var x = i * xvel + xoff;
        var y = i * yvel + yoff;
        if (x < w) {
            d = {
                "cx": x,
                "cy": y,
                "radius": 10,
                "color": circlecolor
            };

            circleData.push(d);
        }
    }


    /*
    xoff = 20;
    yoff = 20;
    xvel = 40;
    yvel = 50;
    for (var i = 0; i < 10; i++) {
        var x = i * xvel + xoff;
        var y = i * yvel + yoff;
        if (x < w) {
            d = {
                "cx": x,
                "cy": y,
                "radius": 10,
                "color": circlecolor
            };

            circleData.push(d);
        }
    }

    xoff = 20;
    yoff = 20;
    xvel = 20;
    yvel = 60;
    for (var i = 0; i < 10; i++) {
        var x = i * xvel + xoff;
        var y = i * yvel + yoff;
        if (x < w) {
            d = {
                "cx": x,
                "cy": y,
                "radius": 10,
                "color": circlecolor
            };

            circleData.push(d);
        }
    }


    xoff = 20;
    yoff = 20;
    xvel = 60;
    yvel = 20;
    for (var i = 0; i < 10; i++) {
        var x = i * xvel + xoff;
        var y = i * yvel + yoff;
        if (x < w) {
            d = {
                "cx": x,
                "cy": y,
                "radius": 10,
                "color": circlecolor
            };

            circleData.push(d);
        }
    }
    */

    return circleData;

}


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
                "cx": x,
                "cy": y,
                "radius": 10,
                "color": circlecolor
            };

            circleData.push(d);
        }
    }

    return circleData;

}



function gaussianData() {


    var circleData = [];



  var gauss = science.stats.distribution.gaussian();

    var xoff = 30;
    var yoff = 20;
    var xvel = 60;
    var yvel = 50;
    for (var i = 0; i < 40; i++) {
        
        var j = (i-20)/4;
        var x = j*70 + 350;
        var y =  -gauss.pdf(j)*1200 + 550;
        

      
        
        if ((x < w) && (y < h)) {

            d = {
                "cx": x,
                "cy": y,
                "radius": 10,
                "color": circlecolor
            };

            circleData.push(d);
        }
    }

    return circleData;

  }


function drawBox(svgContainer){
      var left = svgContainer.append("rect").attr("width", 1).attr("height", h)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var right = svgContainer.append("rect").attr("width", 1).attr("height", h)
        .attr("x", w - 2).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var top = svgContainer.append("rect").attr("width", w).attr("height", 1)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var down = svgContainer.append("rect").attr("width", w).attr("height", 1)
        .attr("x", 0).attr("y", h - 2).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 1.0);

    var box = svgContainer.append("rect").attr("width", w).attr("height", h)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 0.00);        

}

function resetContainer(){
  /*create new svg element , just to be safe */

      var main = d3.select('body').select('#graph');

    main.select("svg")
        .remove();

    svgContainer = main.append("svg").attr("width", w).attr("height", h)

    drawBox(svgContainer);

}

function drawPlot(circleData) {

  
   resetContainer();


    xpos_label = d3.select('body').select('#xpos');

    var box = svgContainer.append("rect").attr("width", w).attr("height", h)
        .attr("x", 0).attr("y", 0).attr("fill", d3.rgb(0, 20, 80)).attr("fill-opacity", 0.00);





    circles = svgContainer.selectAll("circle")
        .data(circleData)
        .enter()
        .append("circle");

    var circleAttributes = circles
        .attr("cx", function (d) {
        return d.cx;
    })
        .attr("cy", function (d) {
        return d.cy;
    })
        .attr("r", function (d) {
        return d.radius;
    })
        .style("fill", function (d) {
        return circlecolor;
    });


    //Add the SVG Text Element to the svgContainer
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
    
    circles.select(function(d,i) {            
        all_xy.push(d);
    });

    $.post("/stat/regression/", {
        vals: JSON.stringify(all_xy)
    }, function (data) {
        
        var resultDict = jQuery.parseJSON(data);
        
        d3.select('#slope_all').text(resultDict["slope"]);

        d3.select('#std_err_all').text(resultDict["std_err"]);      

        d3.select('#r_value_all').text(resultDict["r_value"]);      

        
    });
}



function mdown() {
    startmouse = d3.mouse(this);

    mouse_pressed = true;

    startX = d3.mouse(this)[mxpos];
    startY = d3.mouse(this)[mypos];

    d3.select('#downflag').text("down  " + "x : " + Math.round(startX) + " y: " + Math.round(startY));


    d3.select('#info').attr("x", 50);
}



function move() {



    var curX = d3.mouse(this)[mxpos];
    var curY = d3.mouse(this)[mypos];

    d3.select('#xpos').text("x : " + Math.round(curX) + " y: " + Math.round(curY));


    if (mouse_pressed) {

        // only brush if mouse is down

        // custom brush function
        // d3 has it's own brush though


        //set min and max

        var minx = startX < curX ? startX : curX;
        var maxx = startX < curX ? curX : startX;
        var miny = startY < curY ? startY : curY;
        var maxy = startY < curY ? curY : startY;



        selectBox.attr("width", maxx - minx);
        selectBox.attr("x", minx);
        selectBox.attr("y", miny);
        selectBox.attr("height", maxy - miny);


        //fill all with init color   
        circles.style("fill", circlecolor);


        var curX = d3.mouse(this)[mxpos];
        var curY = d3.mouse(this)[mypos];
        var minx = startX < curX ? startX : curX;
        var maxx = startX < curX ? curX : startX;
        var miny = startY < curY ? startY : curY;
        var maxy = startY < curY ? curY : startY;


        // select based on x y coordinates
        selected_circles = circles.select(function (d, i) {

            var hit = d["cx"] > minx && d["cx"] < maxx && d["cy"] > miny && d["cy"] < maxy;

            return hit ? this : null;

        });

        selected_xy = [];

        // mark the selection with color
        selected_circles.style("fill", selectcolor);


        selected_circles.each(function (d, i) {
            selected_xy.push(d);
        });


    }

}



function up() {


    mouse_pressed = false;

    var curX = Math.round(d3.mouse(this)[mxpos], 3);
    var curY = Math.round(d3.mouse(this)[mypos], 3);

    var deltax = Math.round(curX - startX, 3);
    var deltay = Math.round(curY - startY, 3);


    $.post("/stat/average/", {
        vals: JSON.stringify(selected_xy)
    }, function (data) {
        d3.select('#x_avgstat').text("avg x: " + data);
    });

    $.post("/stat/median/", {
        vals: JSON.stringify(selected_xy)
    }, function (data) {
        d3.select('#x_medianstat').text("median x: " + data);
    });



    $.post("/stat/average/", {
        vals: JSON.stringify(selected_xy)
    }, function (data) {
        d3.select('#y_avgstat').text("avg y: " + data);
    });

    $.post("/stat/median/", {
        vals: JSON.stringify(selected_xy)
    }, function (data) {
        d3.select('#y_medianstat').text("median y: " + data);
    });


    $.post("/stat/regression/", {
        vals: JSON.stringify(selected_xy)
    }, function (data) {

        
        var resultDict = jQuery.parseJSON(data);
        
        d3.select('#slope_selected').text(resultDict["slope"]);

        d3.select('#std_err_selected').text(resultDict["std_err"]);      

        d3.select('#r_value_selected').text(resultDict["r_value"]);      

        
    });


    d3.select('#count').text("selected: " + selected_xy.length);


    d3.select('#upflag').text("up  " + "x : " + curY + " y: " + curY);
    d3.select('#deltax').text("delta x " + deltax);
    d3.select('#deltay').text("delta y " + deltay);

    selectBox.attr("width", 0);
    selectBox.attr("height", 0);


    setTimeout(resetInfo, 1000);
}


function resetInfo() {
    d3.select('#upflag').text("");
    d3.select('#downflag').text("");
    d3.select('#deltax').text("");
    d3.select('#deltay').text("");
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





function  drawLoess(){

// Copyright (c) 2011, Jason Davies
//from https://github.com/jasondavies/science.js/blob/master/examples/loess/loess.js

/*
      



    var  p = 30.5,
      n = 100,
      x = d3.scale.linear().range([0, w]),
      y = d3.scale.linear().domain([-2.5, 1.5]).range([h, 0]);



  var xAxis = d3.svg.axis().scale(x),
      yAxis = d3.svg.axis().scale(y);

  var temp = svgContainer.append('svg');

  var vis = temp
      .data([{
        x: d3.range(n).map(function(i) { return (i / n); }),
        y: d3.range(n).map(function(i) { return Math.sin(4 * i * Math.PI / n) + (Math.random() - .5) / 5; })
      }])
    .append("svg")
      .attr("width", w + p + p)
      .attr("height", h + p + p)
    .append("g")
      .attr("transform", "translate(" + p + "," + p + ")");

  var loess = science.stats.loess().bandwidth(.2),
      line = d3.svg.line()
        .x(function(d) { 
          selected_x.append(x(d[0]));
          return x(d[0]); 
        })
        .y(function(d) { 
          selected_y.append(x(d[1]));
          return y(d[1]);
         });

        



  vis.selectAll("circle")
      .data(function(d) { return d3.zip(d.x, d.y); })
    .enter().append("circle")
      .attr("cx", function(d) { return x(d[0]); })
      .attr("cy", function(d) { return y(d[1]); })
      .attr("r", 4);

      drawBox(svgContainer);
*/
}