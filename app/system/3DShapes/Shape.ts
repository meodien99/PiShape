/**
 * Created by madcat on 11/30/15.
 */
    ///<reference path="../Canvas3D.ts"/>

    ///<reference path="Pt3d.ts"/>
///<reference path="../2DShapes/Pt2d.ts"/>

module Shape3D {
    export class Shape {
        canvas : System.Canvas3D;
        ctx : CanvasRenderingContext2D;

        rotScanvasfMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]];
        rotScanvasfQ = false;
        vCanvasQ = false;

        eye: Pt3d;
        pts = [];

        depth : number;

        shapeType : string = "surf";
        //shapeSource : string;
        clrMethod : string = "None";

        transMatrix;
        f : number = 500;

        lineWeight : number;
        lineClr : string = 'white';
        fillClr : string = 'rgba(255,0,0,0.9)';

        showPtsQ : boolean = false;
        centroid: Pt3d = new Pt3d();
        vcanvas3d: Pt3d = new Pt3d();
        hideCount : number = 0;

        constructor (canvas:System.Canvas3D){
            this.canvas = canvas;
            this.transMatrix = this.rotScanvasfMatrix;
            this.ctx = this.canvas.ctx;
            this.eye = new Pt3d();
            this.eye.setMe(0, 0, 400);
        }

        public drawSurface(aboutEyeQ:boolean, viewType:string){
            var xsum = 0;
            var ysum = 0;
            var zsum = 0;
            var clips = [];
            var zMin = Number.MAX_VALUE;
            var zMax = -Number.MAX_VALUE;
            var i = 0;
            var ptRot;
            while(i < this.pts.length){
                var pt3d = this.pts[i];
                if(aboutEyeQ){

                } else {
                    ptRot = this.matrixPointMultiple(this.canvas.transMatrix, pt3d);
                    clips.push(ptRot);
                }
                zMin = Math.min(zMin, ptRot.z);
                zMax = Math.max(zMax, ptRot.z);

                xsum += ptRot.x;
                ysum += ptRot.y;
                zsum += ptRot.z;

                i++;
            }
            //point2Ds
            var pt2s = [];
            i = 0;
            while(i < clips.length) {
                var p3d = clips[i];
                var pt = new Shape2D.Pt2d();
                pt.x = this.canvas.width/2 + (this.eye.z * (p3d.x)) / (this.eye.z + p3d.z);
                pt.y = this.canvas.height/2 + (this.eye.z * (p3d.y)) / (this.eye.z + p3d.z);
                pt2s.push(pt);
                i++;
            }
            var fillQ = true;
            var strokeQ = true;
            switch (this.clrMethod){
                case "Glass":
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.fillStyle = this.fillClr;
                    break;
                case "PureGlass":
                    this.ctx.lineWidth = 1;
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.fillStyle = this.fillClr;
                    break;
                case "Beams":
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = 'rgb(0, 255, 0)';
                    this.ctx.fillStyle = 'rgba(250,250,250,0.2)';
                    this.ctx.lineJoin = "round";
                    break;
                case "Shaded":
                    this.ctx.fillStyle = this.fillClr;
                    strokeQ = false;
                    break;
                default :
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = this.lineClr;
                    this.ctx.fillStyle = this.fillClr;
            }

            if(pt2s.length > 2){
                this.ctx.beginPath();
                for(i = 0; i < pt2s.length; i++){
                    pt = pt2s[i];
                    if(i === 0)
                        this.ctx.moveTo(pt.x, pt.y);
                    else
                        this.ctx.lineTo(pt.x, pt.y);
                }
                this.ctx.closePath();

                if(strokeQ) this.ctx.stroke();
                if(fillQ) this.ctx.fill();
            }

            var iRecip = 1 / (pt2s.length + 1);
            xsum *= iRecip;
            ysum *= iRecip;
            zsum *= this.f - zsum * iRecip;

            this.depth = (xsum * xsum + ysum * ysum + zsum * zsum) / 10000;
        }

        public matrixPointMultiple(A:Array<number>, B:Pt3d):Pt3d {
            var C = new Pt3d();
            C.x = A[0][0] * B.x + A[0][1] * B.y + A[0][2] * B.z;
            C.y = A[1][0] * B.x + A[1][1] * B.y + A[1][2] * B.z;
            C.z = A[2][0] * B.x + A[2][1] * B.y + A[2][2] * B.z;
            return C;
        }

        public setPts(pointArray){
            this.pts = [];
            for(var i = 0; i < pointArray.length; i++){
                var p3d = new Pt3d();
                p3d.setMe(pointArray[i][0], pointArray[i][1], pointArray[i][2]);
                this.pts.push(p3d);
            }
            this.calcCentroid();
        }

        public calcCentroid(){
            this.centroid = new Pt3d();
            for(var i = 0; i < this.pts.length; i++){
                this.centroid.addPoint2Me(this.pts[i]);
            }
            if(this.pts.length > 0){
                this.centroid.x /= this.pts.length;
                this.centroid.y /= this.pts.length;
                this.centroid.z /= this.pts.length;
            }
        }

        public doShading(){
            var alpha = 0.5;
            switch (this.clrMethod){
                case "Glass":
                case "PureGlass":
                    alpha = 0.5;
                    break;
                default:
            }
            var angle = Shape3D.Shape.getNormalAngle(this.pts, 0);
            var dark = (1 - angle/ Math.PI);
            var red = (0 * 255 >> 0) + 1;
            var grn = (dark * 255 >> 0) + 1;
            angle = Shape3D.Shape.getNormalAngle(this.pts, 1);
            dark = (1 - angle / Math.PI);
            var blu = (0 * 255 >> 0) + 1;
            this.fillClr = 'rgba(' + red + ',' + grn + ',' + blu + ',' + alpha +')';
        }

        public static getNormalAngle(points, dimN){
            var a = [points[1].x - points[0].x, points[1].y - points[0].y, points[1].z - points[0].z];
            var b = [points[2].x - points[1].x, points[2].y - points[1].y, points[2].z - points[1].z];
            var cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
            var mag = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2]);
            var theta = Math.acos(cross[dimN] / mag);
            return theta;
        }

        public static convertHexClr(hex, opacity):string {
            hex = hex.replace('#', '');
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        }

        public static rgb2hex(color:Array<number>):string {
            var hex = [];
            for(var i = 0; i < 3; i++){
                hex.push(color[i].toString(16));
                if(hex[i].length < 2){
                    hex[i] = "0" + hex[i];
                }
            }
            return "#" + hex[0] + hex[1] + hex[2];
        }
    }
}