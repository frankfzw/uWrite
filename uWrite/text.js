var ctx = context;

var points = [];

points.push({x:150, y:100});
points.push({x:250, y:150});
points.push({x:350, y:150});
points.push({x:400, y:100});
points.push({x:450, y:150});
points.push({x:460, y:200});
points.push({x:500, y:250});

ctx.moveTo(points[0].x, points[0].y);


for (i = 1; i < points.length - 2; i ++)
{
  var xc = (points[i].x + points[i + 1].x) / 2;
  var yc = (points[i].y + points[i + 1].y) / 2;
  ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
}
 // curve through the last two points
 ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);