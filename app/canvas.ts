/**
 * Created by madcat on 11/11/15.
 */
    ///<reference path="shape.ts"/>

module System {
    interface StylePadding {
        left : number;
        top : number;
        right : number;
        bottom : number;
    }

    interface StyleBorder {
        left : number;
        top : number;
        right : number;
        bottom : number;
    }
    export class Canvas {
        canvas: HTMLCanvasElement; //canvas DOM object
        width : number;
        height : number;
        ctx : CanvasRenderingContext2D | WebGLRenderingContext;
        stylePadding : StylePadding;
        styleBorder : StyleBorder;
        //htmlTop : number;
        //htmlLeft : number;

        // when set to true, the canvas will redraw everything
        valid : boolean = false;

        // the collection of things to be drawn
        shapes : Shape[] = [];

        // Keep track of when we are dragging
        dragging : boolean = false;

        // the current selected object
        selection = null;

        dragoffX : number = 0;
        dragoffY : number = 0;
        constructor(canvas : HTMLCanvasElement, ctype :string = '2d') {
            this.canvas  = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
            this.ctx = canvas.getContext(ctype);
            this._init();
        }
        private _init() : void{
            var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
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

            //var html = document.body.parentNode;
            //this.htmlTop = (html.hasAttributes('offsetTop')) ? html.attributes.getNamedItem('offsetTop') : 0;
            //this.htmlLeft = (html.hasAttributes('offsetLeft')) ? html.attributes.getNamedItem('offsetLeft') : 0;

            var myState = this;

            //fixes a problem where double clicking causes text to get selected on the canvas
            this.canvas.addEventListener('selectstart', function(e){
                e.preventDefault();
                return false;
            }, false);

            this.canvas.addEventListener('mousedown', function(e){
                var mouse, mx, my;
                mouse = myState.getMouse(e);
                mx = mouse.x;
                my = mouse.y;

                var shapes = myState.getShapes();
                var l = shapes.length;

                for(var i = l - 1; i >= 0; i -- ) {
                    if(shapes[i].contains(mx, my)) {
                        var shape = shapes[i];

                        // Keep track of where in the object we clicked
                        // so we can move it smoothly (mousemove)
                        myState.dragoffX = mx - shape.x;
                        myState.dragoffY = my - shape.y;
                    }
                }
            })
        }

        getShapes() : Shape[] {
            return this.shapes;
        }

        getMouse(e : MouseEvent) : any {
            var element = this.canvas,
                eins,
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
            offsetX += this.stylePadding.left + this.styleBorder.left ;
            offsetY += this.stylePadding.top  + this.styleBorder.top ;

            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;

            return {
                x : mx,
                y : my
            };
        }
    }
}