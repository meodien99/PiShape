/**
 * Created by madcat on 11/11/15.
 */
module System {

    export class Shape {
        x : number ;
        y : number ;
        fill : string;
        constructor(x:number, y:number, fill : string = "#AAAAAA"){
            this.x = x;
            this.y = y;
            this.fill = fill;
        }
        draw(ctx: CanvasRenderingContext2D | WebGLRenderingContext) : void {}
        contains(mx: number, my: number) : boolean { return true }
    }
}