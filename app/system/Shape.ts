/**
 * Created by madcat on 11/13/15.
 */
module System {
    export interface ShapeInterface {
        draw (ctx: CanvasRenderingContext2D):void;
        isMouseIn(mx : number, my: number) : boolean;
    }

    export class Shape implements ShapeInterface{
        x:number; // x-axis
        y:number; // y-axis
        constructor(x:number, y:number){
            this.x = x;
            this.y = y;
        }

        //fill shape
        fill(ctx: CanvasRenderingContext2D, color: string = '#000') {
            ctx.fillStyle = color;
            ctx.fill();
        }
        draw (ctx: CanvasRenderingContext2D):void {}

        isMouseIn(mx : number, my: number) : boolean {
            return true;
        }
    }
}