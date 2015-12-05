/**
 * Created by madcat on 11/13/15.
 */
var System;
(function (System) {
    var Shape = (function () {
        function Shape(x, y) {
            this.x = x;
            this.y = y;
        }
        //fill shape
        Shape.prototype.fill = function (ctx, color) {
            if (color === void 0) { color = '#000'; }
            ctx.fillStyle = color;
            ctx.fill();
        };
        Shape.prototype.draw = function (ctx) { };
        Shape.prototype.isMouseIn = function (mx, my) {
            return true;
        };
        return Shape;
    })();
    System.Shape = Shape;
})(System || (System = {}));
/**
 *
 * Created by madcat on 11/13/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="./Shape.ts"/>
var System;
(function (System) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, radius, startAngle, endAngle, counterClockwise) {
            if (startAngle === void 0) { startAngle = 0.0; }
            if (endAngle === void 0) { endAngle = 2.0; }
            _super.call(this, x, y);
            this.counterClockwise = false;
            this.r = radius;
            this.startAngle = startAngle * Math.PI;
            this.endAngle = endAngle * Math.PI;
            if (counterClockwise)
                this.counterClockwise = counterClockwise;
        }
        Circle.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle, this.counterClockwise);
            ctx.lineWidth = 1;
            ctx.stroke();
        };
        Circle.prototype.isMouseIn = function (mx, my) {
            return (this.r >= Math.sqrt(Math.abs(Math.pow(mx - this.x, 2) + Math.pow(my - this.y, 2))));
        };
        return Circle;
    })(System.Shape);
    System.Circle = Circle;
})(System || (System = {}));
/**
 * Created by madcat on 11/13/15.
 */
///<reference path="Shape.ts"/>
var System;
(function (System) {
    var Canvas = (function () {
        function Canvas(canvas, ctype) {
            if (ctype === void 0) { ctype = '2d'; }
            this.shapes = [];
            this.valid = false;
            this.dragging = false;
            this.dragOffX = 0;
            this.dragOffY = 0;
            this.INTERVAL = 30;
            this.stylePadding = { top: 0, left: 0, right: 0, bottom: 0 };
            this.styleBorder = { top: 0, left: 0, right: 0, bottom: 0 };
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this._init();
        }
        Canvas.prototype._init = function () {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                this.stylePadding.left = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10) || 0;
                this.stylePadding.top = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10) || 0;
                this.stylePadding.right = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingRight'], 10) || 0;
                this.stylePadding.bottom = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingBottom'], 10) || 0;
                this.styleBorder.left = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
                this.styleBorder.top = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10) || 0;
                this.styleBorder.right = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderRightWidth'], 10) || 0;
                this.styleBorder.bottom = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderBottomWidth'], 10) || 0;
            }
            var html = document.body.parentNode;
            this.htmlTop = html.offsetTop || 0;
            this.htmlLeft = html.offsetLeft || 0;
            var myState = this;
            //canvas events
            this._onSelectStartEvent();
            this._onMouseDownEvent();
            this._onMouseUpEvent();
            this._onMouseMoveEvent();
            //draw
            setInterval(function () {
                myState.draw();
            }, myState.INTERVAL);
        };
        Canvas.prototype._onSelectStartEvent = function () {
            this.canvas.addEventListener('selectstart', function (e) {
                e.preventDefault();
                return false;
            }, false);
        };
        Canvas.prototype._onMouseDownEvent = function () {
            var myState = this;
            this.canvas.addEventListener('mousedown', function (e) {
                var mouse = myState.getMouse(e);
                var mx = mouse.x;
                var my = mouse.y;
                var shapes = myState.getShapes();
                var l = shapes.length;
                for (var i = l - 1; i >= 0; i--) {
                    if (shapes[i].isMouseIn(mx, my)) {
                        var mySel = shapes[i];
                        // Keep track of where in the object we clicked
                        // so we can move it smoothly (mousemove)
                        myState.dragOffX = mx - mySel.x;
                        myState.dragOffY = my - mySel.y;
                        myState.dragging = true;
                        myState.currentPoint = mySel;
                        myState.valid = false;
                        return;
                    }
                }
                // havent returned means we have failed to select anything.
                // If there was an object selected, we deselect it
                if (myState.currentPoint) {
                    myState.currentPoint = null;
                    myState.valid = false; // need to clear the old currentPoint border
                }
            }, true);
        };
        Canvas.prototype._onMouseMoveEvent = function () {
            var myState = this;
            this.canvas.addEventListener('mousemove', function (e) {
                if (myState.dragging) {
                    var mouse = myState.getMouse(e);
                    // We don't want to drag the object by its top-left corner,
                    // we want to drag from where we clicked.
                    // Thats why we saved the offset and use it here
                    myState.currentPoint.x = mouse.x - myState.dragOffX;
                    myState.currentPoint.y = mouse.y - myState.dragOffY;
                    myState.valid = false;
                }
            }, true);
        };
        Canvas.prototype._onMouseUpEvent = function () {
            var myState = this;
            this.canvas.addEventListener('mouseup', function (e) {
                myState.dragging = false;
            }, true);
        };
        //private _onDbClick():void{}
        Canvas.prototype.draw = function () {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            this.clear();
            var l = shapes.length;
            for (var i = 0; i < l; i++) {
                var shape = shapes[i];
                shape.draw(ctx);
                shape.fill(ctx);
            }
        };
        Canvas.prototype.getContext = function () {
            return this.ctx;
        };
        Canvas.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        Canvas.prototype.getDimension = function () {
            return {
                width: this.canvas.width,
                height: this.canvas.height
            };
        };
        Canvas.prototype.addShape = function (shape) {
            this.shapes.push(shape);
            this.valid = false;
        };
        Canvas.prototype.getShapes = function () {
            return this.shapes;
        };
        Canvas.prototype.getMouse = function (e) {
            var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
            //Computed total offset
            if (element.offsetParent !== undefined) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }
            // Add padding and border style widths to offset
            // Also add the offset in case there's a position:fixed bar
            offsetX += this.stylePadding.left + this.styleBorder.left + this.htmlLeft;
            offsetY += this.stylePadding.top + this.styleBorder.top + this.htmlTop;
            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;
            return {
                x: mx,
                y: my
            };
        };
        return Canvas;
    })();
    System.Canvas = Canvas;
})(System || (System = {}));
/**
 * Created by madcat on 11/15/15.
 */
///<reference path="Canvas.ts"/>
///<reference path="Circle.ts"/>
var System;
(function (System) {
    var CanvasLine = (function (_super) {
        __extends(CanvasLine, _super);
        function CanvasLine() {
            _super.apply(this, arguments);
        }
        CanvasLine.prototype.addShapeBag = function (coordinates) {
            this.shapes = [];
            for (var i = 0; i < coordinates.length; i++) {
                var coordinate = coordinates[i];
                var point = new System.Circle(coordinate.x, coordinate.y, 5);
                this.shapes.push(point);
            }
        };
        CanvasLine.prototype.draw = function () {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            this.clear();
            var l = shapes.length;
            for (var i = 0; i < l; i++) {
                var shape = shapes[i];
                //draw point
                shape.draw(ctx);
                if (this.currentPoint != null && shape.isMouseIn(this.currentPoint.x, this.currentPoint.y)) {
                    shape.fill(ctx, 'red');
                }
                else
                    shape.fill(ctx);
            }
            this._drawLine();
            this._drawAngleSymbol();
            //if(this.currentPoint != null){
            //    //ctx.strokeStyle = this.selectionColor;
            //    //ctx.lineWidth = this.selectionWidth;
            //    var mySel = this.currentPoint;
            //    ctx.arc(mySel.x, mySel.y, 5);
            //}
            // Add stuff you want draw on top all the time here
            this.valid = true;
        };
        CanvasLine.prototype._drawAngleSymbol = function () {
            var shapes = this.getShapes();
            var l = shapes.length;
            for (var i = 0; i < l; i++) {
                if (i === 0) {
                    this.drawAngleSymbol(shapes[l - 1], shapes[i], shapes[i + 1]);
                }
                else if (i === l - 1) {
                    this.drawAngleSymbol(shapes[i - 1], shapes[i], shapes[0]);
                }
                else {
                    this.drawAngleSymbol(shapes[i - 1], shapes[i], shapes[i + 1]);
                }
            }
        };
        CanvasLine.prototype._drawLine = function () {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            var l = shapes.length;
            var angle = 0; //text angle
            for (var i = 0; i < l; i++) {
                var shape = shapes[i];
                var pt1, pt3;
                ctx.save();
                ctx.lineWidth = 2;
                //draw line
                if (i === 0) {
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y);
                    pt1 = shapes[i + 1];
                    pt3 = shapes[l - 1];
                }
                else if (i === (l - 1)) {
                    ctx.lineTo(shape.x, shape.y);
                    ctx.lineTo(shapes[0].x, shapes[0].y);
                    pt1 = shapes[i - 1];
                    pt3 = shapes[0];
                    ctx.stroke();
                }
                else {
                    ctx.lineTo(shape.x, shape.y);
                    pt1 = shapes[i - 1];
                    pt3 = shapes[i + 1];
                }
                angle = this._getAngle(pt1, shapes[i], pt3, false);
                ctx.restore();
            }
        };
        /**
         * Angle from 3 points :
         * @param p1
         * @param p2 <---- that's angle value returned
         * @param p3
         * @param isRad {boolean} type : angle returned by rad or deg
         */
        CanvasLine.prototype._getAngle = function (p1, p2, p3, isRad) {
            if (isRad === void 0) { isRad = true; }
            // cosC = (a^2 + b^2 - c^2)/(2*a*b)
            var p1p2 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            var p2p3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
            var p1p3 = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
            var angle = Math.acos((Math.pow(p1p2, 2) + Math.pow(p2p3, 2) - Math.pow(p1p3, 2)) / (2 * p1p2 * p2p3));
            if (isRad) {
                return angle;
            }
            else {
                return Math.round((angle * 180 / Math.PI) * 100) / 100;
            }
        };
        /**
         * draw angle symbol
         * @param p3
         * @param p2 <--- angle here
         * @param p1
         */
        CanvasLine.prototype.drawAngleSymbol = function (p3, p2, p1) {
            var ctx = this.ctx;
            var dx1 = p1.x - p2.x;
            var dy1 = p1.y - p2.y;
            var dx2 = p3.x - p2.x;
            var dy2 = p3.y - p2.y;
            var a1 = Math.atan2(dy1, dx1);
            var a2 = Math.atan2(dy2, dx2);
            //draw angle symbol
            ctx.save();
            ctx.setLineDash([1, 2]);
            ctx.beginPath();
            ctx.moveTo(p2.x, p2.y);
            //if(Math.abs((a2 - a1)*180/Math.PI) === 90){
            //    ctx.rect(p2.x, p2.y - 15, 15, 15);
            //} else {
            ctx.arc(p2.x, p2.y, 15, a2, a1);
            //}
            ctx.lineWidth = 2;
            ctx.closePath();
            ctx.stroke();
            this._drawAngleText(p3, p2, p1);
            ctx.restore();
        };
        CanvasLine.prototype._drawAngleText = function (p3, p2, p1) {
            var angle = this._getAngle(p1, p2, p3, false);
            var angleText = angle.toString() + "°";
            var ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = 'blue';
            if (p2.x < p1.x && p2.x < p3.x) {
                /**
                 *   .p2
                 *
                 *                   .p3
                 *          .p1
                 */
                if (p2.y < p1.y && p2.y < p3.y)
                    ctx.fillText(angleText, p2.x + 20, p2.y + angle / 10);
                else if ((p2.y <= p1.y && p2.y >= p3.y) || (p2.y <= p3.y && p2.y >= p1.y))
                    ctx.fillText(angleText, p2.x + 20, p2.y + angle / 8);
                else if (p2.y >= p1.y && p2.y >= p3.y)
                    ctx.fillText(angleText, p2.x + 20, p2.y - 20);
                else
                    console.log("ve kieu gi the nay");
            }
            else if (p2.x > p1.x && p2.x > p3.x) {
                /**
                 *                          .p2
                 *
                 *  .p3
                 *          .p1
                 */
                if (p2.y <= p1.y && p2.y <= p3.y)
                    ctx.fillText(angleText, p2.x - 20, p2.y + angle / 10);
                else if ((p2.y <= p1.y && p2.y >= p3.y) || (p2.y <= p3.y && p2.y >= p1.y))
                    ctx.fillText(angleText, p2.x - 20, p2.y);
                else if (p2.y >= p1.y && p2.y >= p3.y)
                    ctx.fillText(angleText, p2.x - angle / 10, p2.y - 20);
                else
                    console.log("dhs ?");
            }
            else if ((p2.x <= p1.x && p2.x >= p3.x) || (p2.x <= p3.x && p2.x >= p1.x)) {
                /**
                 *          .p2
                 *
                 *                   .p3/1
                 * .p1/3
                 *
                 */
                if (p2.y <= p1.y && p2.y <= p3.y)
                    ctx.fillText(angleText, p2.x - angle / 10, p2.y + 20);
                else if (p2.y >= p1.y && p2.y >= p3.y)
                    ctx.fillText(angleText, p2.x - angle / 10, p2.y - 20);
                else if ((p2.y <= p1.y && p2.y >= p3.y) || (p2.y <= p3.y && p2.y >= p1.y))
                    ctx.fillText(angleText, p2.x + angle / 10, p2.y + 20);
                else
                    console.log("db con case nao luon");
            }
            else {
                console.log("con case nao nhi");
            }
            ctx.restore();
        };
        return CanvasLine;
    })(System.Canvas);
    System.CanvasLine = CanvasLine;
})(System || (System = {}));
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
var canvas = new System.CanvasLine(document.getElementById('canvas'));
var points = [{ x: 50, y: 50 }, { x: 250, y: 200 }, { x: 180, y: 30 }, { x: 210, y: 110 }];
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
