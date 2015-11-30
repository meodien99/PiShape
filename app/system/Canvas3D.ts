/**
 * Created by madcat on 11/30/15.
 */
    ///<reference path="Canvas.ts"/>
///<reference path="3DShapes/Poly.ts"/>

module System {
    export class Canvas3D extends Canvas {

        shapeName : string;

        isCurvy : boolean = false;
        isFlat : boolean = false;
        isExplode : boolean = false;
        isDragQ : boolean = false;
        isDraggingQ : boolean = false;

        mouseX : number = 0;
        mouseY : number = 0;
        prevMouseX : number = 0;
        prevMouseY : number = 0;


        poly : Shape3D.Poly;
        xAngle : number = 2;
        yAngle : number = 4;
        zAngle : number = 0;

        ratio : number;
        transMatrix : Array<Array<number>> = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]];
        f : number = 500; //fov
        clrs : Array<string> = ["#ff0000", "#0000ff", "#ff9900", "#00ff00", "#ffff00", "#660066", "#99ff00", "#0099ff", "#00ff99", "#9900ff", "#ff0099", "#006666", "#666600", "#990000", "#009999", "#999900", "#003399", "#ff00ff", "#993333", "#330099"];

        width : number;
        height : number;

        public init(){
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            //add Event Listener
            this.canvas.addEventListener('touchstart', this._onTouchStart, false);
            this.canvas.addEventListener('touchmove', this._onTouchMove, false);
            this.canvas.addEventListener('mousedown', this._onMouseDown, false);
            this.canvas.addEventListener('mousemove', this._onMouseMove, false);
            this.canvas.addEventListener('mouseup', this._onMouseUp, false);
        }


        public polyhedrawMain(shapeName:string):void {
            this.shapeName = typeof shapeName !== 'undefined' ? shapeName : 'pent-pyramid';
            this.isCurvy = ['cone','cylinder','sphere','hemisphere'].indexOf(this.shapeName) >= 0;
            this.isFlat = ['plane'].indexOf(this.shapeName) >= 0;

        }

        private _onTouchStart (event){
            this.isDraggingQ = true;
            var touch = event.targetTouches[0];
            var bRect = this.canvas.getBoundingClientRect();

            this.prevMouseX = (touch.clientX - bRect.left) * (this.width / this.ratio / bRect.width);
            this.prevMouseY = (touch.clientY - bRect.top) * (this.height / this.ratio / bRect.height);
        }

        private _onTouchMove (event){
            var touch = event.targetTouches[0];
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.touchQ = true;
            this._onMouseMove(event);
            event.preventDefault();
        }

        private _onMouseDown (event){
            this.isDraggingQ = true;
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
        }

        private _onMouseMove (event){
            var bRect = this.canvas.getBoundingClientRect();
            this.mouseX = (event.clientX - bRect.left) * (this.width / this.ratio / bRect.width);
            this.mouseY = (event.clientY - bRect.top) * (this.height / this.ratio / bRect.height);

            if(this.isDragQ){
                if(this.isDraggingQ){
                    this.setTransMatrix(-(this.prevMouseY - this.mouseY) * 3, (this.prevMouseX - this.mouseX)*3, 0, this.transMatrix);
                    this.prevMouseX = this.mouseX;
                    this.prevMouseY = this.mouseY;
                    this.update();
                }
            } else {
                this.xAngle = -(this.mouseX - this.width / 2) / 25;
                this.yAngle = (this.mouseY - this.height / 2) / 25;
            }
        }

        private _onMouseUp (event){
            this.isDraggingQ = false;
        }

        public setTransMatrix(x, y, z, M): void {
            var vectorLength = Math.sqrt(x*x + y*y + z*z);
            if(vectorLength > 0.0001){
                x /= vectorLength;
                y /= vectorLength;
                z /= vectorLength;

                var Theta = vectorLength / 500;
                var cosT = Math.cos(Theta);
                var sinT = Math.sin(Theta);
                var tanT = 1 - cosT;
                var T = [[], [], []];
                T[0][0] = tanT * x *x + cosT;
                T[0][1] = tanT * x * y - sinT *z;
                T[0][2] = tanT * x * z + sinT * y;


                T[1][0] = tanT * x * y + sinT * z;
                T[1][1] = tanT * y * y + cosT;
                T[1][2] = tanT * y * z - sinT * x;

                T[2][0] = tanT * x * z - sinT * y;
                T[2][1] = tanT * y * z + sinT * x;
                T[2][2] = tanT * z * z + cosT;

                this.transMatrix = this._matrixMultiple(T, M);
            }
        }

        private _matrixMultiple(A, B): Array<Array<number>>{
            var C = [[], [], []];
            C[0][0] = A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0];
            C[0][1] = A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1];
            C[0][2] = A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2];

            C[1][0] = A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0];
            C[1][1] = A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1];
            C[1][2] = A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2];

            C[2][0] = A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0];
            C[2][1] = A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1];
            C[2][2] = A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2];

            return C;
        }
    }
}