/**
 * Created by madcat on 11/30/15.
 */
module System {
    export class Canvas {
        canvas : HTMLCanvasElement;
        ctx : CanvasRenderingContext2D;
        constructor ( canvas : HTMLCanvasElement) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.init();
        }
        public init():void {}
    }
}