function kde(sample) {
  /* Epanechnikov kernel */
  function epanechnikov(u) {
    return Math.abs(u) <= 1 ? 0.75 * (1 - u*u) : 0;
  };

  var kernel = epanechnikov;
  return {
    scale: function(h) {
      kernel = function (u) { 
        var e =epanechnikov(u / h) / h ;
        
        return e; 

      };
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