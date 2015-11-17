/**
 * Created by madcat on 11/13/15.
 */

///<reference path="system/Circle.ts"/>
///<reference path="system/CanvasLine.ts"/>


//var canvas = new System.Canvas(<HTMLCanvasElement> document.getElementById('canvas'));
//
//var x = canvas.getDimension().width/2 - 20;
//var y = canvas.getDimension().height/2;
//var radius = 20;
//
//var circle = new System.Circle(x, y, radius);
//canvas.addShape(circle);
//canvas.addShape(new System.Circle(x + 70, y, radius));
//
//canvas.draw();
var canvas = new System.CanvasLine(<HTMLCanvasElement> document.getElementById('canvas'));

var points = [{x:50, y:50}, {x: 250, y:200}, {x: 180, y: 30}];

canvas.addShapeBag(points);
canvas.draw();
//var x = canvas.getDimension().width/2 - 20;
//var y = canvas.getDimension().height/2;
//var radius = 20;
//
//var circle = new System.Circle(x, y, radius);
//canvas.addShape(circle);
//canvas.addShape(new System.Circle(x + 70, y, radius));
//
//canvas.draw();