/**
 *
 * Created by madcat on 11/13/15.
 */

///<reference path="./Shape.ts"/>

module System {
    export class Circle extends Shape implements ShapeInterface {
        r : number; // radius
        startAngle : number;
        endAngle : number;
        counterClockwise : boolean = false;

        constructor(x:number, y:number, radius : number, startAngle: number = 0.0, endAngle: number = 2.0,counterClockwise?: boolean) {
            super(x, y);
            this.r = radius;
            this.startAngle = startAngle * Math.PI;
            this.endAngle = endAngle * Math.PI;
            if(counterClockwise)
                this.counterClockwise = counterClockwise;
        }

        public draw (ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle, this.counterClockwise);

            ctx.lineWidth = 1;
            ctx.stroke();
        }

        public isMouseIn (mx: number, my: number) : boolean {
            return (this.r >= Math.sqrt(Math.abs(Math.pow(mx - this.x, 2) + Math.pow(my - this.y, 2))));
        }
    }
}