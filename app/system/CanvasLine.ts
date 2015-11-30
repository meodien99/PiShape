/**
 * Created by madcat on 11/15/15.
 */

    ///<reference path="Canvas2D.ts"/>
///<reference path="Circle.ts"/>

module System {
    export class CanvasLine extends Canvas2D {

        public addShapeBag(coordinates: Array<{x:number; y:number;}>):void {
            this.shapes = [];
            for(var i = 0; i < coordinates.length; i++){
                var coordinate = coordinates[i];
                var point = new Circle(coordinate.x, coordinate.y,5);
                this.shapes.push(point);
            }
        }

        public draw(): void {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            this.clear();

            var l = shapes.length;

            for(var i = 0; i < l; i++){
                var shape = shapes[i];

                //draw point
                shape.draw(ctx);
                if(this.currentPoint != null && shape.isMouseIn(this.currentPoint.x, this.currentPoint.y)){
                        shape.fill(ctx, 'red');
                } else
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
        }

        private _drawAngleSymbol(): void {
            var shapes = this.getShapes();
            var l = shapes.length;

            for(var i = 0; i < l; i++) {
                if( i === 0 ){
                    this.drawAngleSymbol(shapes[l - 1], shapes[i], shapes[i + 1]);
                } else if (i === l - 1) { //end
                    this.drawAngleSymbol(shapes[i - 1], shapes[i], shapes[0]);
                } else {
                    this.drawAngleSymbol(shapes[i - 1], shapes[i], shapes[i + 1]);
                }
            }
        }

        private _drawLine(): void {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            var l = shapes.length;
            var angle = 0; //text angle

            for(var i = 0; i < l; i++){
                var shape = shapes[i];
                var pt1, pt3;
                ctx.save();
                ctx.lineWidth = 2;
                //draw line
                if(i === 0) { //begin
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y);
                    pt1 = shapes[i + 1];
                    pt3 = shapes[l - 1];
                } else if (i === (l - 1)){ //end
                    ctx.lineTo(shape.x, shape.y);
                    ctx.lineTo(shapes[0].x, shapes[0].y);
                    pt1 = shapes[i - 1];
                    pt3 = shapes[0];
                    ctx.stroke();
                } else {
                    ctx.lineTo(shape.x, shape.y);
                    pt1 = shapes[i - 1];
                    pt3 = shapes[i + 1];
                }
                angle = this._getAngle(pt1, shapes[i], pt3, false);
                ctx.restore();
            }

        }

        /**
         * Angle from 3 points :
         * @param p1
         * @param p2 <---- that's angle value returned
         * @param p3
         * @param isRad {boolean} type : angle returned by rad or deg
         */
        private _getAngle(p1, p2, p3, isRad:boolean = true) : number {
            // cosC = (a^2 + b^2 - c^2)/(2*a*b)
            var p1p2 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y,2));
            var p2p3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y,2));
            var p1p3 = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y,2));
            var angle = Math.acos((Math.pow(p1p2,2) + Math.pow(p2p3,2) - Math.pow(p1p3,2))/ (2 * p1p2 * p2p3));
            if(isRad) {
                return angle;
            } else {
                return Math.round((angle * 180 / Math.PI)*100)/100;
            }
        }

        /**
         * draw angle symbol
         * @param p3
         * @param p2 <--- angle here
         * @param p1
         */
        public drawAngleSymbol(p3, p2, p1){
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
        }

        private _drawAngleText(p3, p2, p1):void {
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
                /**
                 *          .p1/3
                 *
                 *
                 *   .p2
                 *
                 *                   .p3/1
                 *
                 */
                else if ((p2.y <= p1.y && p2.y >= p3.y) || (p2.y <= p3.y && p2.y >= p1.y))
                    ctx.fillText(angleText, p2.x + 20, p2.y + angle / 8);

                /**
                 *            .p1/3
                 *
                 *                      .p3/1
                 *
                 *
                 *    .p2
                 *
                 */
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
                /**
                 *
                 *      .p3/1
                 *                          .p2
                 *
                 *
                 *          .p1/3
                 */
                else if ((p2.y <= p1.y && p2.y >= p3.y) || (p2.y <= p3.y && p2.y >= p1.y))
                    ctx.fillText(angleText, p2.x - 20, p2.y);
                /**
                 *            .p1/3
                 *
                 *    .p3/1
                 *
                 *
                 *                      .p2
                 *
                 */
                else if (p2.y >= p1.y && p2.y >= p3.y)
                    ctx.fillText(angleText, p2.x - angle/10, p2.y - 20);
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
                    ctx.fillText(angleText, p2.x - angle/10, p2.y + 20);
                /**
                 *
                 *                   .p3/1
                 * .p1/3
                 *
                 *          .p2
                 */
                else if (p2.y >= p1.y && p2.y >= p3.y)
                    ctx.fillText(angleText, p2.x - angle/10, p2.y - 20);
                /**
                 *
                 *                   .p3/1
                 *      .p2
                 *
                 *   .p1/3
                 */
                else if ((p2.y <= p1.y && p2.y >= p3.y) || (p2.y <= p3.y && p2.y >= p1.y))
                    ctx.fillText(angleText, p2.x + angle/10, p2.y + 20);
                else
                    console.log("db con case nao luon")
            } else {
                console.log("con case nao nhi");
            }
            ctx.restore();
        }
    }
}