///**
// * Created by madcat on 11/11/15.
// */
//
/////<reference path="./shape.ts"/>
//
//module System {
//    export class Circle extends Shape {
//        radius: number;
//        startAngle : number;
//        endAngle : number;
//        counterClockwise : boolean;
//
//        constructor(x:number, y:number, radius : number, startAngle : number = 0.0, endAngle : number = 2.0,counterClockwise : boolean = false) {
//            super(x, y);
//            this.radius = radius;
//            this.startAngle = startAngle * Math.PI ;
//            this.endAngle = endAngle * Math.PI;
//            this.counterClockwise = counterClockwise;
//        }
//
//        draw(ctx: any) : void {
//            ctx.fillStyle(this.fill);
//            ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterClockwise);
//        }
//
//        contains(mx:number, my:number): boolean {
//            return (this.radius >= Math.sqrt(Math.abs(Math.pow(mx - this.x, 2) + Math.pow(my - this.y, 2))));
//        }
//    }
//} 
//# sourceMappingURL=circle.js.map