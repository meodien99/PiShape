/**
 * Created by madcat on 11/30/15.
 */
    ///<reference path="Canvas.ts"/>
///<reference path="3DShapes/Poly.ts"/>
///<reference path="3DShapes/Shape.ts"/>

module System {
    export class Canvas3D extends Canvas {

        shapeName : string;
        shapes : Array<Shape3D.Shape> = [];

        isCurvy : boolean = false;
        isFlat : boolean = false;
        isExplode : boolean = false;
        isDragQ : boolean = true;
        isDraggingQ : boolean = false;

        mouseX : number = 0;
        mouseY : number = 0;
        prevMouseX : number = 0;
        prevMouseY : number = 0;

        frameNo : number = 0;

        poly : Shape3D.Poly;
        xAngle : number = 2;
        yAngle : number = 4;
        zAngle : number = 0;

        ratio : number;
        transMatrix;
        f : number = 500; //fov
        clrs : Array<string> = ["#ff0000", "#0000ff", "#ff9900", "#00ff00", "#ffff00", "#660066", "#99ff00", "#0099ff", "#00ff99", "#9900ff", "#ff0099", "#006666", "#666600", "#990000", "#009999", "#999900", "#003399", "#ff00ff", "#993333", "#330099"];

        width : number;
        height : number;

        constructor(canvas){
            super(canvas);
            this.init();
        }

        public init(){
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.poly = new Shape3D.Poly(this);
            this.transMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]];

            //add Event Listener
            this._onTouchStartEvent ();
            this._onTouchMoveEvent();
            this._onMouseDownEvent();
            this._onMouseMoveEvent();
            this._onMouseUpEvent();
        }

        public polyhedraMain(shapeName:string):void {
            this.shapeName = typeof shapeName !== 'undefined' ? shapeName : 'pent-pyramid';
            this.isCurvy = ['cone','cylinder','sphere','hemisphere'].indexOf(this.shapeName) >= 0;
            this.isFlat = ['plane'].indexOf(this.shapeName) >= 0;
            this.ratio = 1;
            this.ctx.setTransform(this.ratio, 0 , 0, this.ratio, 0, 0);

            this._init();
        }

        private _init(){
            this.shapes = [];
            this.poly.shapeType = this.shapeName;
            this._setShapesFromPoly();
            this.setTransMatrix(200, 50, 0, this.transMatrix);
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawShapes();
            this.frameNo = 0;
            this.animate();
        }

        private animate() {
            this.frameNo ++;
            if(this.isDragQ){

            } else {
                this.setTransMatrix(this.xAngle, this.yAngle, this.zAngle, this.transMatrix);
                this.update();
            }
            if(this.frameNo < 1e8){
                requestAnimationFrame(this.animate.bind(this));
            }
        }

        public restart(){
            this.shapes = [];
            this.poly.shapeType = this.shapeName;
            this._setShapesFromPoly();
            this.update();
        }

        public update(){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawShapes();
        }

        public drawShapes(){
            var prevDepth = 0;
            var sortNeededQ = false;
            for(var i = 0, len = this.shapes.length; i < len; i++){
                var shape = this.shapes[i];
                shape.drawSurface(false, "N");
                if(i > 0){
                    if(shape.depth < prevDepth){
                        sortNeededQ = true;
                    }
                }
                prevDepth = shape.depth;
            }
            if(sortNeededQ){
                this.shapes.sort(function(a, b){
                    if(a.depth < b.depth) return -1;
                    return 1;
                });
            }
        }

        public toggleBtn(btn, onq){
            if(onq){
                document.getElementById(btn).classList.add("hi");
                document.getElementById(btn).classList.remove("lo");
            } else {
                document.getElementById(btn).classList.add("lo");
                document.getElementById(btn).classList.remove("hi");
            }
        }

        public toggleExplode(){
            this.isExplode = !this.isExplode;
            this.toggleBtn("explodeBtn", this.isExplode);
            this.restart();
        }

        public clrChg(){
            var el = <any> document.getElementById('clrType');
            if (el.selectedIndex == -1)
                return null;
            var t = el.options[el.selectedIndex].text;
            this.setClrs(t);
            this.update();
        }

        public toggleDrag(){
            this.isDragQ = !this.isDragQ;
            this.toggleBtn("dragBtn", this.isDragQ);
            if(this.isDragQ){
                document.getElementById("dragBtn").innerHTML = 'Drag';
            } else {
                document.getElementById("dragBtn").innerHTML = 'Spin';
            }
        }

        private _setShapesFromPoly() {
            var C = this.poly.getSolid();
            var i = 0;
            while(i < C.length){
                var surf = C[i];
                this.addShape3D("surface", this.coords2Lines(surf, this.poly.scale), 1, "#fff", "rgba(0, 255, 0, 0.3)");
                i++;
            }
            this.setClrs(this.getClrType());
        }

        public coords2Lines(surf, scale){
            var P = [], toNum;
            var midPt = [0, 0, 0]; //mid point
            for(var i = 0; i < surf.length; i++){
                if(i < surf.length - 1){
                    toNum = i + 1;
                } else {
                    toNum = 0;
                }
                P[i] = [];
                if(surf[i] == undefined){
                    console.error("Error surface >>> " + i, surf[i]);
                } else {
                    for(var j = 0; j < 3; j++){
                        P[i][j] = surf[i][j] * scale;
                        if(this.isExplode)
                            midPt[j] += P[i][j];
                    }
                }
            }
            if(this.isExplode){
                for(var j = 0; j < 3; j++){
                    midPt[j] /= surf.length;
                }
                for(var i = 0; i < surf.length; i++){
                    for(var j = 0; j < 3; j++){
                        P[i][j] += midPt[j]/2;
                    }
                }
            }
            return P;
        }

        public addShape3D(shapeType, pontArray, lineWeight, lineClr, fillClr){
            var shape = new Shape3D.Shape(this);
            shape.transMatrix = this.transMatrix;
            shape.f = this.f;
            shape.setPts(pontArray);
            shape.shapeType = shapeType;
            shape.lineWeight = lineWeight;
            shape.lineClr = lineClr;
            shape.fillClr = fillClr;
            this.shapes.push(shape);
        }

        public setClrs(clrMethod){
            for(var i = 0; i < this.shapes.length; i++){
                var shape = this.shapes[i];
                shape.clrMethod = clrMethod;
                switch (clrMethod){
                    case "Multi":
                        shape.fillClr = Shape3D.Shape.convertHexClr(this.clrs[i % this.clrs.length], 0.7);
                        break;
                    case "Two":
                        shape.fillClr = Shape3D.Shape.convertHexClr(this.clrs[i % 2], 0.8);
                        break;
                    case "Smooth":
                        var fromMiddle = Math.abs(this.shapes.length / 2 - i);
                        var blu = fromMiddle * 8 + 1;
                        var ccc = Shape3D.Shape.rgb2hex([blu, 128, blu]);
                        shape.fillClr = ccc;
                        break;
                    case "Glass":
                    case "PureGlass":
                        shape.doShading();
                        break;
                    case "Shaded":
                        shape.doShading();
                        break;
                    default:
                }
            }
        }

        public getClrType(){
            if (this.isCurvy || this.isFlat) {
                if (this.shapeName == 'plane') {
                    return "Glass";
                } else {
                    return "Shaded";
                }
            } else {
                var div = <any> document.getElementById('clrType');
                if (div.selectedIndex == -1)return 'Multi';
                return div.options[div.selectedIndex].text;
                //return "Multi";
            }
        }

        public setTransMatrix(x, y, z, M) {
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
                T[0][0] = tanT * x * x + cosT;
                T[0][1] = tanT * x * y - sinT * z;
                T[0][2] = tanT * x * z + sinT * y;

                T[1][0] = tanT * x * y + sinT * z;
                T[1][1] = tanT * y * y + cosT;
                T[1][2] = tanT * y * z - sinT * x;

                T[2][0] = tanT * x * z - sinT * y;
                T[2][1] = tanT * y * z + sinT * x;
                T[2][2] = tanT * z * z + cosT;

                this.transMatrix = this._matrixMatrixMultiple(T, M);
            }
        }

        private _matrixMatrixMultiple(A, B): Array<Array<number>>{
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

        /* EVENT LISTENER */

        private _onTouchStartEvent (){
            var self = this;
            this.canvas.addEventListener('touchstart', function(event){
                self.isDraggingQ = true;
                var touch = event.targetTouches[0];
                var bRect = self.canvas.getBoundingClientRect();

                self.prevMouseX = (touch.clientX - bRect.left) * (self.width / self.ratio / bRect.width);
                self.prevMouseY = (touch.clientY - bRect.top) * (self.height / self.ratio / bRect.height);
            }, false);
        }

        private _onTouchMoveEvent (){
            var self = this;
            this.canvas.addEventListener('touchmove', function(event:any){
                console.log(event);
                var touch = event.targetTouches[0];
                event.clientX = touch.clientX;
                event.clientY = touch.clientY;
                event.touchQ = true;
                self._onMouseMove(event);
                event.preventDefault();
            }, false);
        }

        private _onMouseDownEvent (){
            var self = this;
            this.canvas.addEventListener('mousedown', function(event){
                self.isDraggingQ = true;
                self.prevMouseX = self.mouseX;
                self.prevMouseY = self.mouseY;
            }, false);
        }

        private _onMouseMoveEvent (){
            var self = this;
            this.canvas.addEventListener('mousemove', function(event){
                var bRect = self.canvas.getBoundingClientRect();
                self.mouseX = (event.clientX - bRect.left) * (self.width / self.ratio / bRect.width);
                self.mouseY = (event.clientY - bRect.top) * (self.height / self.ratio / bRect.height);
                if(self.isDragQ){
                    if(self.isDraggingQ){
                        self.setTransMatrix(-(self.prevMouseY - self.mouseY) * 3, (self.prevMouseX - self.mouseX)*3, 0, self.transMatrix);
                        self.prevMouseX = self.mouseX;
                        self.prevMouseY = self.mouseY;
                        self.update();
                    }
                } else {
                    self.xAngle = -(self.mouseX - self.width / 2) / 25;
                    self.yAngle = (self.mouseY - self.height / 2) / 25;
                }

            }, false);
        }

        private _onMouseMove(event){
            console.log("asd");
            var self = this;
            var bRect = self.canvas.getBoundingClientRect();
            self.mouseX = (event.clientX - bRect.left) * (self.width / self.ratio / bRect.width);
            self.mouseY = (event.clientY - bRect.top) * (self.height / self.ratio / bRect.height);

            if(self.isDragQ){
                if(self.isDraggingQ){
                    self.setTransMatrix(-(self.prevMouseY - self.mouseY) * 3, (self.prevMouseX - self.mouseX)*3, 0, self.transMatrix);
                    self.prevMouseX = self.mouseX;
                    self.prevMouseY = self.mouseY;
                    self.update();
                }
            } else {
                self.xAngle = -(self.mouseX - self.width / 2) / 25;
                self.yAngle = (self.mouseY - self.height / 2) / 25;
            }
        }

        private _onMouseUpEvent (){
            var self = this;
            this.canvas.addEventListener('mouseup',function(event){
                self.isDraggingQ = false;
            }, false);
        }

    }
}