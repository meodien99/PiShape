/**
 * Created by madcat on 11/15/15.
 */

    ///<reference path="Canvas.ts"/>

module System {
    export class CanvasLine extends Canvas {

        public draw() {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            this.clear();

            var l = shapes.length;

            for(var i = 0; i < l; i++){
                var shape = shapes[i];

                if(i === 0) {
                    ctx.moveTo(shape.x, shape.y);
                }
            }
        }
    }
}