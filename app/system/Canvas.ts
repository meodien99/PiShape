/**
 * Created by madcat on 11/13/15.
 */
///<reference path="Shape.ts"/>

module System {
    interface CornerStyle {
        top : number;
        left : number;
        right : number;
        bottom : number;
    }

    export class Canvas {
        canvas : HTMLCanvasElement;
        ctx : CanvasRenderingContext2D;
        shapes : Array<Shape> = [];
        valid : boolean = false;
        dragging : boolean = false;

        currentPoint : {x:number; y:number;};
        dragOffX : number = 0;
        dragOffY : number = 0;

        INTERVAL: number = 30;

        stylePadding : CornerStyle = {top:0, left:0, right:0, bottom: 0};
        styleBorder : CornerStyle = {top:0, left:0, right:0, bottom: 0};
        constructor(canvas : HTMLCanvasElement, ctype :string = '2d') {
            this.canvas  = canvas;
            this.ctx = canvas.getContext('2d');
            this._init();
        }
        htmlTop : number;
        htmlLeft : number;
        private _init() {
            if(document.defaultView && document.defaultView.getComputedStyle){
                this.stylePadding.left = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10) || 0;
                this.stylePadding.top = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10) || 0;
                this.stylePadding.right = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingRight'], 10) || 0;
                this.stylePadding.bottom = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingBottom'], 10) || 0;
                this.styleBorder.left = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
                this.styleBorder.top = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10) || 0;
                this.styleBorder.right = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderRightWidth'], 10) || 0;
                this.styleBorder.bottom = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderBottomWidth'], 10) || 0;
            }

            var html = <HTMLElement> document.body.parentNode;
            this.htmlTop = html.offsetTop || 0;
            this.htmlLeft = html.offsetLeft || 0;
            var myState = this;

            //canvas events

            this._onSelectStartEvent();
            this._onMouseDownEvent();
            this._onMouseUpEvent();
            this._onMouseMoveEvent();

            //draw
            setInterval(function(){
                myState.draw();
            }, myState.INTERVAL);
        }

        private _onSelectStartEvent(): void {
            this.canvas.addEventListener('selectstart', function(e){
                e.preventDefault();
                return false;
            }, false);
        }

        private _onMouseDownEvent(): void {
            var myState = this;
            this.canvas.addEventListener('mousedown', function(e){
                var mouse =  myState.getMouse(e);
                var mx = mouse.x;
                var my = mouse.y;
                var shapes = myState.getShapes();

                var l = shapes.length;

                for(var i = l - 1; i >= 0; i--){
                    if(shapes[i].isMouseIn(mx, my)) {
                        var mySel = shapes[i];

                        // Keep track of where in the object we clicked
                        // so we can move it smoothly (mousemove)
                        myState.dragOffX = mx - mySel.x;
                        myState.dragOffY = my - mySel.y;

                        myState.dragging = true;
                        myState.currentPoint = mySel;
                        myState.valid =false;
                        return;
                    }
                }

                // havent returned means we have failed to select anything.
                // If there was an object selected, we deselect it

                if(myState.currentPoint){
                    myState.currentPoint = null;
                    myState.valid = false; // need to clear the old currentPoint border
                }
            }, true);
        }

        private _onMouseMoveEvent(): void {
            var myState = this;
            this.canvas.addEventListener('mousemove', function(e){
                if(myState.dragging){
                    var mouse = myState.getMouse(e);
                    // We don't want to drag the object by its top-left corner,
                    // we want to drag from where we clicked.
                    // Thats why we saved the offset and use it here
                    myState.currentPoint.x = mouse.x - myState.dragOffX;
                    myState.currentPoint.y = mouse.y - myState.dragOffY;
                    myState.valid = false;
                }
            }, true);
        }

        private _onMouseUpEvent(): void {
            var myState = this;
            this.canvas.addEventListener('mouseup', function(e){
                myState.dragging = false;
            }, true);
        }

        //private _onDbClick():void{}

        public draw ():void {
            var ctx = this.ctx;
            var shapes = this.getShapes();
            this.clear();

            var l = shapes.length;

            for(var i = 0; i < l; i++){
                var shape = shapes[i];
                shape.draw(ctx);
                shape.fill(ctx);
            }
        }

        public getContext(): CanvasRenderingContext2D {
            return this.ctx;
        }

        public clear (): void{
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        public getDimension (): {width: number; height: number;} {
            return {
                width : this.canvas.width,
                height : this.canvas.height
            }
        }

        public addShape(shape): void {
            this.shapes.push(shape);
            this.valid = false;
        }

        public getShapes(): Array<Shape> {
            return this.shapes;
        }

        public getMouse(e : MouseEvent) : {x: number; y:number;} {
            var element = this.canvas,
                offsetX = 0, offsetY = 0,
                mx, my;

            //Computed total offset
            if(element.offsetParent !== undefined) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while((element = <HTMLCanvasElement> element.offsetParent));
            }

            // Add padding and border style widths to offset
            // Also add the offset in case there's a position:fixed bar
            offsetX += this.stylePadding.left + this.styleBorder.left + this.htmlLeft;
            offsetY += this.stylePadding.top  + this.styleBorder.top + this.htmlTop;

            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;

            return {
                x : mx,
                y : my
            };
        }
    }
}