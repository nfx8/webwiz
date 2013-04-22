
 $(document).ready(function() {
      
  drawPlot();

 });


function drawPlot(){
      

      

  var main = d3.select('body').select('#graph');

  var w = 800;
  var h = 600;
  //Create SVG element
  var svg = main.select('svg');


  var bw = 40;

  svg.append("rect").attr("width",bw).attr("height",bw)
    .attr("x",100).attr("y",100).attr("fill","grey").attr("fill-opacity",0.8);


  
}
