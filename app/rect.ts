/**
 * Created by madcat on 11/11/15.
 */
///<reference path="./shape.ts"/>

module System {
    export class Rect extends Shape {
        width : number;
        height : number;

        constructor(x: number, y:number, width: number, height: number){
            super(x, y);
            this.width = width;
            this.height = height;
        }

        draw(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle(this.fill);
            ctx.rect(this.x, this.y, this.width, this.height);
        }

        contains (mx :number, my: number) : boolean {
            return (this.x <= mx) && (this.x + this.width >= mx)
                && (this.y <= my) && (this.y + this.height >= my)
        }
    }
}
