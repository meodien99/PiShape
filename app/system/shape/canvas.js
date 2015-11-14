///**
// * Created by madcat on 11/11/15.
// */
//    ///<reference path="shape.ts"/>
//    ///<reference path="rect.ts"/>
//
//module System {
//    export class Canvas {
//        canvas: HTMLCanvasElement; //canvas DOM object
//        width : number;
//        height : number;
//        ctx : CanvasRenderingContext2D;
//        stylePaddings : any;
//        styleBorders : any;
//        //htmlTop : number;
//        //htmlLeft : number;
//
//        // when set to true, the canvas will redraw everything
//        valid : boolean = false;
//
//        // the collection of things to be drawn
//        shapes : Shape[] = [];
//
//        // Keep track of when we are dragging
//        dragging : boolean = false;
//
//        // the current selected object
//        selection = null;
//
//        dragoffX : number = 0;
//        dragoffY : number = 0;
//
//        // **** Options ****
//        selectionColor: string;
//        selectionWidth : number;
//        interval : number = 30;
//
//        constructor(canvas : HTMLCanvasElement, ctype :string = '2d') {
//            this.canvas  = canvas;
//            this.width = canvas.width;
//            this.height = canvas.height;
//            this.ctx = canvas.getContext('2d');
//            this._init();
//        }
//        private _init() : void{
//            var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
//            if(document.defaultView && document.defaultView.getComputedStyle){
//                this.stylePaddings.left = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10) || 0;
//                this.stylePaddings.top = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10) || 0;
//                this.stylePaddings.right = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingRight'], 10) || 0;
//                this.stylePaddings.bottom = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingBottom'], 10) || 0;
//                this.styleBorders.left = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
//                this.styleBorders.top = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10) || 0;
//                this.styleBorders.right = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderRightWidth'], 10) || 0;
//                this.styleBorders.bottom = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderBottomWidth'], 10) || 0;
//            }
//
//            //var html = document.body.parentNode;
//            //this.htmlTop = (html.hasAttributes('offsetTop')) ? html.attributes.getNamedItem('offsetTop') : 0;
//            //this.htmlLeft = (html.hasAttributes('offsetLeft')) ? html.attributes.getNamedItem('offsetLeft') : 0;
//
//            var myState = this;
//
//            //fixes a problem where double clicking causes text to get selected on the canvas
//            this.canvas.addEventListener('selectstart', function(e){
//                e.preventDefault();
//                return false;
//            }, false);
//
//            this.canvas.addEventListener('mousedown', function(e){
//                var mouse, mx, my;
//                mouse = myState.getMouse(e);
//                mx = mouse.x;
//                my = mouse.y;
//
//                var shapes = myState.getShapes();
//                var l = shapes.length;
//
//                for(var i = l - 1; i >= 0; i -- ) {
//                    if(shapes[i].contains(mx, my)) {
//                        var shape = shapes[i];
//
//                        // Keep track of where in the object we clicked
//                        // so we can move it smoothly (mousemove)
//                        myState.dragoffX = mx - shape.x;
//                        myState.dragoffY = my - shape.y;
//
//                        myState.dragging = true;
//                        myState.selection = shape;
//                        myState.valid = false;
//                        return;
//                    }
//                }
//
//                // haven't returned means we have failed to select anything.
//                // If there was an object selected, we deselect it
//
//                if(myState.selection) {
//                    myState.selection = null;
//                    myState.valid = false; // Need to clear the old selection border
//                }
//            }, true);
//
//            this.canvas.addEventListener('mousemove', function(e){
//                if(myState.dragging){
//                    var mouse = myState.getMouse(e);
//
//                    // We don't want to drag the object by its top-left corner,
//                    // we want to drag from where we clicked.
//                    // Thats why we saved the offset and use it here
//                    myState.selection.x = mouse.x - myState.dragoffX;
//                    myState.selection.y = mouse.y - myState.dragoffY;
//
//                    myState.valid = false;
//                }
//            }, true);
//
//            this.canvas.addEventListener('mouseup', function(e){
//                myState.dragging = false;
//            }, true);
//
//            this.canvas.addEventListener('dblcick', function(e){
//                var mouse = myState.getMouse(<MouseEvent> e);
//                myState.addShape(new Rect(mouse.x - 10, mouse.y - 10, 20, 20));
//            }, true);
//
//            // **** Options ****
//
//            this.selectionColor = '#CC0000';
//            this.selectionWidth = 2;
//            this.interval = 30;
//            setInterval(function(){
//                myState.draw();
//            }, myState.interval);
//        }
//
//        addShape(shape : Shape) : void {
//            this.shapes.push(shape);
//            this.valid = false;
//        }
//
//        private clear () : void {
//            this.ctx.clearRect(0, 0, this.width, this.height);
//        }
//
//        draw () {
//            //if our state is valid, redraw and validate!
//            if(!this.valid) {
//                var ctx = this.ctx;
//                var shapes = this.shapes;
//                this.clear();
//
//                // And stuff you want draw in the background all the time here
//                // draw all shapes
//
//                var l = shapes.length;
//                for(var i = 0; i < l; i++){
//                    var shape = shapes[i];
//
//                    //We can skip the drawing of elements that have moved off the screen
//                    if(shape.x > this.width || shape.y > this.height) {
//                        //rect
//                        if(shape instanceof Rect){
//                            if(shape.x + shape.width < 0 || shape.y + shape.height < 0 ) {
//                                continue;
//                            }
//                        }
//                        continue;
//                    }
//
//                    shapes[i].draw(ctx);
//                }
//
//                //draw selection
//                // right now this is just a stroke along the edge of the selected Shape
//                if(this.selection != null){
//                    ctx.strokeStyle = this.selectionColor;
//                    ctx.lineWidth = this.selectionWidth;
//                    var mySel = this.selection;
//                    ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
//                }
//            }
//        }
//
//        getShapes() : Array<Shape> {
//            return this.shapes;
//        }
//
//        getMouse(e : MouseEvent) : any {
//            var element = this.canvas,
//                eins,
//                offsetX = 0, offsetY = 0,
//                mx, my;
//
//            //Computed total offset
//            if(element.offsetParent !== undefined) {
//                do {
//                    offsetX += element.offsetLeft;
//                    offsetY += element.offsetTop;
//                } while((element = <HTMLCanvasElement> element.offsetParent));
//            }
//
//            // Add padding and border style widths to offset
//            // Also add the offset in case there's a position:fixed bar
//            offsetX += this.stylePaddings.left + this.styleBorders.left ;
//            offsetY += this.stylePaddings.top  + this.styleBorders.top ;
//
//            mx = e.pageX - offsetX;
//            my = e.pageY - offsetY;
//
//            return {
//                x : mx,
//                y : my
//            };
//        }
//    }
//} 
//# sourceMappingURL=canvas.js.map