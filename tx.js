/**
 * Created by madcat on 11/30/15.
 */
var System;
(function (System) {
    var Canvas = (function () {
        function Canvas(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }
        Canvas.prototype.init = function () { };
        return Canvas;
    })();
    System.Canvas = Canvas;
})(System || (System = {}));
/**
 * Created by madcat on 11/30/15.
 * Point 2D class
 */
var Shape2D;
(function (Shape2D) {
    var Pt2d = (function () {
        function Pt2d() {
            this.x = 0;
            this.y = 0;
        }
        return Pt2d;
    })();
    Shape2D.Pt2d = Pt2d;
})(Shape2D || (Shape2D = {}));
/**
 * Created by madcat on 11/30/15.
 * Point 3D class
 */
///<reference path="../2DShapes/Pt2d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shape3D;
(function (Shape3D) {
    var Pt3d = (function (_super) {
        __extends(Pt3d, _super);
        function Pt3d() {
            _super.call(this);
            this.z = 0;
        }
        Pt3d.prototype.setMe = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        };
        Pt3d.prototype.addPoint2Me = function (point, factor) {
            factor = typeof factor !== 'undefined' ? factor : 1;
            if (factor === 1) {
                this.x += point.x;
                this.y += point.y;
                this.z += point.z;
            }
            else {
                this.x += point.x * factor;
                this.y += point.y * factor;
                this.z += point.z * factor;
            }
        };
        return Pt3d;
    })(Shape2D.Pt2d);
    Shape3D.Pt3d = Pt3d;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 11/30/15.
 */
///<reference path="../Canvas3D.ts"/>
///<reference path="Pt3d.ts"/>
///<reference path="../2DShapes/Pt2d.ts"/>
var Shape3D;
(function (Shape3D) {
    var Shape = (function () {
        function Shape(canvas) {
            this.rotScanvasfMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]];
            this.rotScanvasfQ = false;
            this.vCanvasQ = false;
            this.pts = [];
            this.shapeType = "surf";
            //shapeSource : string;
            this.clrMethod = "None";
            this.f = 500;
            this.lineClr = 'white';
            this.fillClr = 'rgba(255,0,0,0.9)';
            this.showPtsQ = false;
            this.centroid = new Shape3D.Pt3d();
            this.vcanvas3d = new Shape3D.Pt3d();
            this.hideCount = 0;
            this.canvas = canvas;
            this.transMatrix = this.rotScanvasfMatrix;
            this.ctx = this.canvas.ctx;
            this.eye = new Shape3D.Pt3d();
            this.eye.setMe(0, 0, 400);
        }
        Shape.prototype.drawSurface = function (aboutEyeQ, viewType) {
            var xsum = 0;
            var ysum = 0;
            var zsum = 0;
            var clips = [];
            var zMin = Number.MAX_VALUE;
            var zMax = -Number.MAX_VALUE;
            var i = 0;
            var ptRot;
            while (i < this.pts.length) {
                var pt3d = this.pts[i];
                if (aboutEyeQ) {
                }
                else {
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
            while (i < clips.length) {
                var p3d = clips[i];
                var pt = new Shape2D.Pt2d();
                pt.x = this.canvas.width / 2 + (this.eye.z * (p3d.x)) / (this.eye.z + p3d.z);
                pt.y = this.canvas.height / 2 + (this.eye.z * (p3d.y)) / (this.eye.z + p3d.z);
                pt2s.push(pt);
                i++;
            }
            var fillQ = true;
            var strokeQ = true;
            switch (this.clrMethod) {
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
                default:
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = this.lineClr;
                    this.ctx.fillStyle = this.fillClr;
            }
            if (pt2s.length > 2) {
                this.ctx.beginPath();
                for (i = 0; i < pt2s.length; i++) {
                    pt = pt2s[i];
                    if (i === 0)
                        this.ctx.moveTo(pt.x, pt.y);
                    else
                        this.ctx.lineTo(pt.x, pt.y);
                }
                this.ctx.closePath();
                if (strokeQ)
                    this.ctx.stroke();
                if (fillQ)
                    this.ctx.fill();
            }
            var iRecip = 1 / (pt2s.length + 1);
            xsum *= iRecip;
            ysum *= iRecip;
            zsum *= this.f - zsum * iRecip;
            this.depth = (xsum * xsum + ysum * ysum + zsum * zsum) / 10000;
        };
        Shape.prototype.matrixPointMultiple = function (A, B) {
            var C = new Shape3D.Pt3d();
            C.x = A[0][0] * B.x + A[0][1] * B.y + A[0][2] * B.z;
            C.y = A[1][0] * B.x + A[1][1] * B.y + A[1][2] * B.z;
            C.z = A[2][0] * B.x + A[2][1] * B.y + A[2][2] * B.z;
            return C;
        };
        Shape.prototype.setPts = function (pointArray) {
            this.pts = [];
            for (var i = 0; i < pointArray.length; i++) {
                var p3d = new Shape3D.Pt3d();
                p3d.setMe(pointArray[i][0], pointArray[i][1], pointArray[i][2]);
                this.pts.push(p3d);
            }
            this.calcCentroid();
        };
        Shape.prototype.calcCentroid = function () {
            this.centroid = new Shape3D.Pt3d();
            for (var i = 0; i < this.pts.length; i++) {
                this.centroid.addPoint2Me(this.pts[i]);
            }
            if (this.pts.length > 0) {
                this.centroid.x /= this.pts.length;
                this.centroid.y /= this.pts.length;
                this.centroid.z /= this.pts.length;
            }
        };
        Shape.prototype.doShading = function () {
            var alpha = 0.5;
            switch (this.clrMethod) {
                case "Glass":
                case "PureGlass":
                    alpha = 0.5;
                    break;
                default:
            }
            var angle = Shape3D.Shape.getNormalAngle(this.pts, 0);
            var dark = (1 - angle / Math.PI);
            var red = (0 * 255 >> 0) + 1;
            var grn = (dark * 255 >> 0) + 1;
            angle = Shape3D.Shape.getNormalAngle(this.pts, 1);
            dark = (1 - angle / Math.PI);
            var blu = (0 * 255 >> 0) + 1;
            this.fillClr = 'rgba(' + red + ',' + grn + ',' + blu + ',' + alpha + ')';
        };
        Shape.getNormalAngle = function (points, dimN) {
            var a = [points[1].x - points[0].x, points[1].y - points[0].y, points[1].z - points[0].z];
            var b = [points[2].x - points[1].x, points[2].y - points[1].y, points[2].z - points[1].z];
            var cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
            var mag = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2]);
            var theta = Math.acos(cross[dimN] / mag);
            return theta;
        };
        Shape.convertHexClr = function (hex, opacity) {
            hex = hex.replace('#', '');
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        };
        Shape.rgb2hex = function (color) {
            var hex = [];
            for (var i = 0; i < 3; i++) {
                hex.push(color[i].toString(16));
                if (hex[i].length < 2) {
                    hex[i] = "0" + hex[i];
                }
            }
            return "#" + hex[0] + hex[1] + hex[2];
        };
        return Shape;
    })();
    Shape3D.Shape = Shape;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 12/1/15.
 */
///<reference path="../Poly.ts"/>
var Shape3D;
(function (Shape3D) {
    var Cylinder = (function () {
        function Cylinder() {
        }
        Cylinder.createNCylinder = function (ngon) {
            var D = [];
            D[0] = [];
            for (var i = 0; i < ngon; i++) {
                var Angle = (Math.PI * 2 * i) / ngon;
                D[0][i] = [];
                D[0][i][0] = Math.sin(Angle) * 0.8;
                D[0][i][1] = Math.cos(Angle) * 0.8;
                D[0][i][2] = 1.4;
            }
            D[1] = [];
            for (i = 0; i < ngon; i++) {
                Angle = (Math.PI * 2 * i) / ngon;
                D[1][i] = [];
                D[1][i][0] = Math.sin(Angle) * 0.8;
                D[1][i][1] = Math.cos(Angle) * 0.8;
                D[1][i][2] = -1.1;
            }
            for (i = 0; i < ngon; i++) {
                var n = i + 2;
                D[n] = [];
                var i1 = i + 1;
                if (i1 == ngon)
                    i1 = 0;
                D[n][0] = [];
                D[n][0][0] = D[0][i][0];
                D[n][0][1] = D[0][i][1];
                D[n][0][2] = D[0][i][2];
                D[n][1] = [];
                D[n][1][0] = D[0][i1][0];
                D[n][1][1] = D[0][i1][1];
                D[n][1][2] = D[0][i1][2];
                D[n][2] = [];
                D[n][2][0] = D[1][i1][0];
                D[n][2][1] = D[1][i1][1];
                D[n][2][2] = D[1][i1][2];
                D[n][3] = [];
                D[n][3][0] = D[1][i][0];
                D[n][3][1] = D[1][i][1];
                D[n][3][2] = D[1][i][2];
            }
            return D;
        };
        //tri-prism-n
        Cylinder.createTriPrismN = function () {
            return Cylinder.createNCylinder(3);
        };
        //tri-prism
        Cylinder.createTriPrism = function () {
            var a = 1.2, b = 0.7, c = 0.7, d = 0.6;
            var D = [[[-a, -b, -c], [-a, -b, c], [-a, d, 0]], [[a, -b, -c], [a, -b, c], [a, d, 0]], [[-a, -b, -c], [a, -b, -c], [a, -b, c], [-a, -b, c]], [[-a, -b, c], [a, -b, c], [a, d, 0], [-a, d, 0]], [[-a, -b, -c], [-a, d, 0], [a, d, 0], [a, -b, -c]]];
            return D;
        };
        return Cylinder;
    })();
    Shape3D.Cylinder = Cylinder;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 12/1/15.
 */
var Shape3D;
(function (Shape3D) {
    var Cone = (function () {
        function Cone() {
        }
        /**
         * Draw cone and its relation
         * @param n-gonal
         * @param ht
         * @return {Array}
         *
         * ngon = 60 / ht = 1.3  : Cone
         * ngon = 4 / ht = 0.5 : square-pyramid
         * ngon = 5 / ht = 0.7 : pent-pyramid
         */
        Cone.createNCone = function (ngon, ht) {
            var D = [];
            D[0] = [];
            var sumx = 0;
            var sumy = 0;
            for (var i = 0; i < ngon; i++) {
                var Angle = (Math.PI * 2 * i) / ngon;
                D[0][i] = [];
                D[0][i][0] = Math.sin(Angle) * 0.8;
                D[0][i][1] = Math.cos(Angle) * 0.8;
                D[0][i][2] = -ht / 2;
                sumx += D[0][i][0];
                sumy += D[0][i][1];
            }
            var appexX = sumx / ngon;
            var appexY = sumy / ngon;
            for (i = 0; i < ngon; i++) {
                var n = i + 1;
                D[n] = [];
                D[n][0] = [];
                D[n][0][0] = appexX;
                D[n][0][1] = appexY;
                D[n][0][2] = ht;
                D[n][1] = [];
                D[n][1][0] = D[0][i][0];
                D[n][1][1] = D[0][i][1];
                D[n][1][2] = D[0][i][2];
                var i1 = i + 1;
                if (i1 == ngon)
                    i1 = 0;
                D[n][2] = [];
                D[n][2][0] = D[0][i1][0];
                D[n][2][1] = D[0][i1][1];
                D[n][2][2] = D[0][i1][2];
            }
            return D;
        };
        Cone.createCone = function () {
            return Cone.createNCone(60, 1.3);
        };
        Cone.createSquarePyramid = function () {
            return Cone.createNCone(4, 0.5);
        };
        Cone.createPentPyramid = function () {
            return Cone.createNCone(5, 0.7);
        };
        Cone.createTetrahedron = function () {
            var D = [
                [
                    [1, 1, 1],
                    [-1, 1, -1],
                    [1, -1, -1]
                ],
                [
                    [-1, 1, -1],
                    [-1, -1, 1],
                    [1, -1, -1]
                ],
                [
                    [1, 1, 1],
                    [1, -1, -1],
                    [-1, -1, 1]
                ],
                [
                    [1, 1, 1],
                    [-1, -1, 1],
                    [-1, 1, -1]
                ]
            ];
            return D;
        };
        Cone.createIrrTetrahedron = function () {
            var D = [
                [
                    [2, 1, -0.2],
                    [-1, 1, -1],
                    [1, -1, -1]
                ],
                [
                    [-1, 1, -1],
                    [-1, -1, 1],
                    [1, -1, -1]
                ],
                [
                    [2, 1, -0.2],
                    [1, -1, -1],
                    [-1, -1, 1]
                ],
                [
                    [2, 1, -0.2],
                    [-1, -1, 1],
                    [-1, 1, -1]
                ]
            ];
            return D;
        };
        return Cone;
    })();
    Shape3D.Cone = Cone;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 12/1/15.
 */
var Shape3D;
(function (Shape3D) {
    var Cube = (function () {
        function Cube() {
        }
        Cube.createCube = function () {
            var D = [
                [
                    [-1, -1, -1],
                    [1, -1, -1],
                    [1, -1, 1],
                    [-1, -1, 1]
                ],
                [
                    [-1, -1, -1],
                    [-1, -1, 1],
                    [-1, 1, 1],
                    [-1, 1, -1]
                ],
                [
                    [-1, -1, 1],
                    [1, -1, 1],
                    [1, 1, 1],
                    [-1, 1, 1]
                ],
                [
                    [-1, 1, -1],
                    [-1, 1, 1],
                    [1, 1, 1],
                    [1, 1, -1]
                ],
                [
                    [1, -1, -1],
                    [1, 1, -1],
                    [1, 1, 1],
                    [1, -1, 1]
                ],
                [
                    [-1, -1, -1],
                    [-1, 1, -1],
                    [1, 1, -1],
                    [1, -1, -1]
                ]
            ];
            return D;
        };
        Cube.createCuboid = function () {
            var a = 1.2, b = 0.7, c = 0.7;
            var D = [
                [
                    [-a, -b, -c],
                    [a, -b, -c],
                    [a, -b, c],
                    [-a, -b, c]
                ],
                [
                    [-a, -b, -c],
                    [-a, -b, c],
                    [-a, b, c],
                    [-a, b, -c]
                ],
                [
                    [-a, -b, c],
                    [a, -b, c],
                    [a, b, c],
                    [-a, b, c]
                ],
                [
                    [-a, b, -c],
                    [-a, b, c],
                    [a, b, c],
                    [a, b, -c]
                ],
                [
                    [a, -b, -c],
                    [a, b, -c],
                    [a, b, c],
                    [a, -b, c]
                ],
                [
                    [-a, -b, -c],
                    [-a, b, -c],
                    [a, b, -c],
                    [a, -b, -c]
                ]
            ];
            return D;
        };
        //penta prism
        Cube.createPentPrism = function () {
            var a = 1.2, b = 0.70, c = 0.73, d = 0.16, e = 0.44;
            var D = [
                [
                    [-a, 0, b],
                    [-a, c, d],
                    [-a, e, -b],
                    [-a, -e, -b],
                    [-a, -c, d]
                ],
                [
                    [a, 0, b],
                    [a, c, d],
                    [a, e, -b],
                    [a, -e, -b],
                    [a, -c, d]],
                [
                    [-a, 0, b],
                    [-a, c, d],
                    [a, c, d],
                    [a, 0, b]
                ],
                [
                    [-a, c, d],
                    [-a, e, -b],
                    [a, e, -b],
                    [a, c, d]
                ],
                [
                    [-a, e, -b],
                    [-a, -e, -b],
                    [a, -e, -b],
                    [a, e, -b]
                ],
                [
                    [-a, -e, -b],
                    [-a, -c, d],
                    [a, -c, d],
                    [a, -e, -b]
                ],
                [
                    [-a, -c, d],
                    [-a, 0, b],
                    [a, 0, b],
                    [a, -c, d]
                ]
            ];
            return D;
        };
        Cube.createStrangePrism = function () {
            var a = 1.2, b = 0.7, c = 0.7;
            var D = [[[-a, -b, -c], [a, -b, -c], [a, -b, c]], [[-a, -b, -c], [-a, -b, c], [-a, b, c]], [[-a, -b, c], [a, -b, c], [a, b, c]], [[-a, b, -c], [-a, b, c], [a, b, c]], [[a, -b, -c], [a, b, -c], [a, b, c]], [[-a, -b, -c], [-a, b, -c], [a, b, -c]]];
            return D;
        };
        return Cube;
    })();
    Shape3D.Cube = Cube;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 12/1/15.
 */
var Shape3D;
(function (Shape3D) {
    var Sphere = (function () {
        function Sphere() {
        }
        Sphere.createOctahedron = function () {
            var a = 3 / (2 * Math.sqrt(2)), b = 3 / 2, D = [[[-a, 0, a], [-a, 0, -a], [0, b, 0]], [[-a, 0, -a], [a, 0, -a], [0, b, 0]], [[a, 0, -a], [a, 0, a], [0, b, 0]], [[a, 0, a], [-a, 0, a], [0, b, 0]], [[a, 0, -a], [-a, 0, -a], [0, -b, 0]], [[-a, 0, -a], [-a, 0, a], [0, -b, 0]], [[a, 0, a], [a, 0, -a], [0, -b, 0]], [[-a, 0, a], [a, 0, a], [0, -b, 0]]];
            return D;
        };
        Sphere.createDodecahedron = function () {
            var phi = (1 + Math.sqrt(5)) / 2, // golden ratio
            a = 1, b = 1 / phi, c = 2 - phi;
            a *= 1.5;
            b *= 1.5;
            c *= 1.5;
            var D = [[[c, 0, a], [-c, 0, a], [-b, b, b], [0, a, c], [b, b, b]], [[-c, 0, a], [c, 0, a], [b, -b, b], [0, -a, c], [-b, -b, b]], [[c, 0, -a], [-c, 0, -a], [-b, -b, -b], [0, -a, -c], [b, -b, -b]], [[-c, 0, -a], [c, 0, -a], [b, b, -b], [0, a, -c], [-b, b, -b]], [[0, a, -c], [0, a, c], [b, b, b], [a, c, 0], [b, b, -b]], [[0, a, c], [0, a, -c], [-b, b, -b], [-a, c, 0], [-b, b, b]], [[0, -a, -c], [0, -a, c], [-b, -b, b], [-a, -c, 0], [-b, -b, -b]], [[0, -a, c], [0, -a, -c], [b, -b, -b], [a, -c, 0], [b, -b, b]], [[a, c, 0], [a, -c, 0], [b, -b, b], [c, 0, a], [b, b, b]], [[a, -c, 0], [a, c, 0], [b, b, -b], [c, 0, -a], [b, -b, -b]], [[-a, c, 0], [-a, -c, 0], [-b, -b, -b], [-c, 0, -a], [-b, b, -b]], [[-a, -c, 0], [-a, c, 0], [-b, b, b], [-c, 0, a], [-b, -b, b]]];
            return D;
        };
        Sphere.createIcosahedron = function () {
            var phi = (1 + Math.sqrt(5)) / 2, // golden ratio
            a = 1 / 2, b = 1 / (2 * phi);
            a *= 3;
            b *= 3;
            var D = [[[0, b, -a], [b, a, 0], [-b, a, 0]], [[0, b, a], [-b, a, 0], [b, a, 0]], [[0, b, a], [0, -b, a], [-a, 0, b]], [[0, b, a], [a, 0, b], [0, -b, a]], [[0, b, -a], [0, -b, -a], [a, 0, -b]], [[0, b, -a], [-a, 0, -b], [0, -b, -a]], [[0, -b, a], [b, -a, 0], [-b, -a, 0]], [[0, -b, -a], [-b, -a, 0], [b, -a, 0]], [[-b, a, 0], [-a, 0, b], [-a, 0, -b]], [[-b, -a, 0], [-a, 0, -b], [-a, 0, b]], [[b, a, 0], [a, 0, -b], [a, 0, b]], [[b, -a, 0], [a, 0, b], [a, 0, -b]], [[0, b, a], [-a, 0, b], [-b, a, 0]], [[0, b, a], [b, a, 0], [a, 0, b]], [[0, b, -a], [-b, a, 0], [-a, 0, -b]], [[0, b, -a], [a, 0, -b], [b, a, 0]], [[0, -b, -a], [-a, 0, -b], [-b, -a, 0]], [[0, -b, -a], [b, -a, 0], [a, 0, -b]], [[0, -b, a], [-b, -a, 0], [-a, 0, b]], [[0, -b, a], [a, 0, b], [b, -a, 0]]];
            return D;
        };
        Sphere.createIcosahedronIntersected = function () {
            var phi = (1 + Math.sqrt(5)) / 2, // golden ratio
            a = 1, b = 1 / phi;
            //var c = 2 - phi;
            a *= 1.5;
            b *= 1.5;
            //c *= 1.5;
            var D = [[[0, b, -a], [b, a, 0], [-b, a, 0]], [[0, 0, 0], [-b, a, 0], [b, a, 0]], [[0, 0, 0], [0, -b, a], [-a, 0, b]], [[0, 0, 0], [a, 0, b], [0, -b, a]], [[0, b, -a], [0, 0, 0], [a, 0, -b]], [[0, b, -a], [-a, 0, -b], [0, 0, 0]], [[0, -b, a], [b, -a, 0], [-b, -a, 0]], [[0, 0, 0], [-b, -a, 0], [b, -a, 0]], [[-b, a, 0], [-a, 0, b], [-a, 0, -b]], [[-b, -a, 0], [-a, 0, -b], [-a, 0, b]], [[b, a, 0], [a, 0, -b], [a, 0, b]], [[b, -a, 0], [a, 0, b], [a, 0, -b]], [[0, 0, 0], [-a, 0, b], [-b, a, 0]], [[0, 0, 0], [b, a, 0], [a, 0, b]], [[0, b, -a], [-b, a, 0], [-a, 0, -b]], [[0, b, -a], [a, 0, -b], [b, a, 0]], [[0, 0, 0], [-a, 0, -b], [-b, -a, 0]], [[0, 0, 0], [b, -a, 0], [a, 0, -b]], [[0, -b, a], [-b, -a, 0], [-a, 0, b]], [[0, -b, a], [a, 0, b], [b, -a, 0]]];
            return D;
        };
        return Sphere;
    })();
    Shape3D.Sphere = Sphere;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 11/30/15.
 */
///<reference path="Shape.ts"/>
///<reference path="Polies/Cylinder.ts"/>
///<reference path="Polies/Cone.ts"/>
///<reference path="Polies/Cube.ts"/>
///<reference path="Polies/Sphere.ts"/>
var Shape3D;
(function (Shape3D) {
    var Poly = (function (_super) {
        __extends(Poly, _super);
        function Poly() {
            _super.apply(this, arguments);
            this.scale = 90;
            this.shapeType = 'cube';
            this.shapeSource = 'calc';
        }
        Poly.prototype.getSolid = function () {
            var C = [];
            switch (this.shapeSource) {
                case "calc":
                    C = this.getCalcSolid();
                    break;
                default:
            }
            return C;
        };
        Poly.prototype.getCalcSolid = function () {
            var C = [];
            this.scale = 90;
            var i, j;
            switch (this.shapeType.toLowerCase()) {
                case "net":
                    C = [
                        [
                            [0, 0, 0],
                            [0, 1, 0],
                            [1, 1, 0],
                            [1, 0, 0]
                        ],
                        [
                            [1, 0, 0],
                            [2, 0, 0],
                            [2, 1, 0],
                            [1, 1, 0]
                        ],
                        [
                            [2, 0, 0],
                            [3, 0, 0],
                            [3, 1, 0],
                            [2, 1, 0]
                        ]
                    ];
                    this.clrMethod = 'Glass';
                    this.scale = 100;
                    break;
                //Cone & Pyramid
                case "cone":
                    C = Shape3D.Cone.createCone();
                    this.scale = 140;
                    this.clrMethod = "Smooth";
                    break;
                case "square-pyramid":
                    C = Shape3D.Cone.createSquarePyramid();
                    this.scale = 180;
                    break;
                case "pent-pyramid":
                    C = Shape3D.Cone.createPentPyramid();
                    this.scale = 180;
                    break;
                //Tetrahedron ( triangular pyramid with three congruent equilateral for each of its faces)
                case "tetrahedron":
                    C = Shape3D.Cone.createTetrahedron();
                    break;
                case "irr-tetrahedron":
                    C = Shape3D.Cone.createIrrTetrahedron();
                    this.scale = 80;
                    break;
                //Cylinder
                case "cylinder":
                    C = Shape3D.Cylinder.createNCylinder(10);
                    break;
                case "tri-prism-n":
                    C = Shape3D.Cylinder.createTriPrismN();
                    this.scale = 100;
                    break;
                case "tri-prism":
                    C = Shape3D.Cylinder.createTriPrism();
                    break;
                //Cube
                case "cube":
                    C = Shape3D.Cube.createCube();
                    break;
                case "cuboid":
                case "rect-prism":
                    C = Shape3D.Cube.createCuboid();
                    break;
                case "pent-prism":
                    C = Shape3D.Cube.createPentPrism();
                    break;
                case "strange-prism":
                    break;
                //octahedron
                case "octahedron":
                    C = Shape3D.Sphere.createOctahedron();
                    this.scale = 50;
                    break;
                case "dodecahedron":
                    C = Shape3D.Sphere.createDodecahedron();
                    break;
                case "icosahedron-intersected":
                    C = Shape3D.Sphere.createIcosahedronIntersected();
                    break;
                case "icosahedron":
                    C = Shape3D.Sphere.createIcosahedron();
                    this.scale = 80;
                    break;
                ////plane & points
                //case"3 points":
                //    C = [[[-1, -1, -1], [1, -1, -1], [1, -1, 1]]];
                //    this.scale = 80;
                //    break;
                //case"4 coplanar points":
                //    C = [[[-1.5, -1, -1], [1, -1, -1], [0.3, -1, 1], [-1.5, -1, 1]]];
                //    this.scale = 80;
                //    break;
                //case"4 points":
                //    C = [[[-1.1, -2, -2], [1, -1, -1], [0.8, 2, 1]], [[1, -1, -1], [0.8, 2, 1], [1.5, -1, 1]]];
                //    this.scale = 70;
                //    break;
                //case"plane":
                //    var a = 0.5;
                //    var b = 0.5;
                //    var c = 0.5;
                //    var d = -3;
                //    C = [];
                //    for (i = 0; i < 6; i++) {
                //        for (j = 0; j < 6; j++) {
                //            C.push([[a, -b + d + i, -c + d + j], [a, b + d + i, -c + d + j], [a, b + d + i, c + d + j], [a, -b + d + i, c + d + j]]);
                //        }
                //    }
                //    this.scale = 50;
                //    break;
                default:
            }
            return C;
        };
        return Poly;
    })(Shape3D.Shape);
    Shape3D.Poly = Poly;
})(Shape3D || (Shape3D = {}));
/**
 * Created by madcat on 11/30/15.
 */
///<reference path="Canvas.ts"/>
///<reference path="3DShapes/Poly.ts"/>
///<reference path="3DShapes/Shape.ts"/>
var System;
(function (System) {
    var Canvas3D = (function (_super) {
        __extends(Canvas3D, _super);
        function Canvas3D(canvas) {
            _super.call(this, canvas);
            this.shapes = [];
            this.isCurvy = false;
            this.isFlat = false;
            this.isExplode = false;
            this.isDragQ = true;
            this.isDraggingQ = false;
            this.mouseX = 0;
            this.mouseY = 0;
            this.prevMouseX = 0;
            this.prevMouseY = 0;
            this.frameNo = 0;
            this.xAngle = 2;
            this.yAngle = 4;
            this.zAngle = 0;
            this.f = 500; //fov
            this.clrs = ["#ff0000", "#0000ff", "#ff9900", "#00ff00", "#ffff00", "#660066", "#99ff00", "#0099ff", "#00ff99", "#9900ff", "#ff0099", "#006666", "#666600", "#990000", "#009999", "#999900", "#003399", "#ff00ff", "#993333", "#330099"];
            this.init();
        }
        Canvas3D.prototype.init = function () {
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.poly = new Shape3D.Poly(this);
            this.transMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]];
            //add Event Listener
            this._onTouchStartEvent();
            this._onTouchMoveEvent();
            this._onMouseDownEvent();
            this._onMouseMoveEvent();
            this._onMouseUpEvent();
        };
        Canvas3D.prototype.polyhedraMain = function (shapeName) {
            this.shapeName = typeof shapeName !== 'undefined' ? shapeName : 'pent-pyramid';
            this.isCurvy = ['cone', 'cylinder', 'sphere', 'hemisphere'].indexOf(this.shapeName) >= 0;
            this.isFlat = ['plane'].indexOf(this.shapeName) >= 0;
            this.ratio = 1;
            this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
            this._init();
        };
        Canvas3D.prototype._init = function () {
            this.shapes = [];
            this.poly.shapeType = this.shapeName;
            this._setShapesFromPoly();
            this.setTransMatrix(200, 50, 0, this.transMatrix);
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawShapes();
            this.frameNo = 0;
            this.animate();
        };
        Canvas3D.prototype.animate = function () {
            this.frameNo++;
            if (this.isDragQ) {
            }
            else {
                this.setTransMatrix(this.xAngle, this.yAngle, this.zAngle, this.transMatrix);
                this.update();
            }
            if (this.frameNo < 1e8) {
                requestAnimationFrame(this.animate.bind(this));
            }
        };
        Canvas3D.prototype.restart = function () {
            this.shapes = [];
            this.poly.shapeType = this.shapeName;
            this._setShapesFromPoly();
            this.update();
        };
        Canvas3D.prototype.update = function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawShapes();
        };
        Canvas3D.prototype.drawShapes = function () {
            var prevDepth = 0;
            var sortNeededQ = false;
            for (var i = 0, len = this.shapes.length; i < len; i++) {
                var shape = this.shapes[i];
                shape.drawSurface(false, "N");
                if (i > 0) {
                    if (shape.depth < prevDepth) {
                        sortNeededQ = true;
                    }
                }
                prevDepth = shape.depth;
            }
            if (sortNeededQ) {
                this.shapes.sort(function (a, b) {
                    if (a.depth < b.depth)
                        return -1;
                    return 1;
                });
            }
        };
        Canvas3D.prototype.toggleBtn = function (btn, onq) {
            if (onq) {
                document.getElementById(btn).classList.add("hi");
                document.getElementById(btn).classList.remove("lo");
            }
            else {
                document.getElementById(btn).classList.add("lo");
                document.getElementById(btn).classList.remove("hi");
            }
        };
        Canvas3D.prototype.toggleExplode = function () {
            this.isExplode = !this.isExplode;
            this.toggleBtn("explodeBtn", this.isExplode);
            this.restart();
        };
        Canvas3D.prototype.clrChg = function () {
            var el = document.getElementById('clrType');
            if (el.selectedIndex == -1)
                return null;
            var t = el.options[el.selectedIndex].text;
            this.setClrs(t);
            this.update();
        };
        Canvas3D.prototype.toggleDrag = function () {
            this.isDragQ = !this.isDragQ;
            this.toggleBtn("dragBtn", this.isDragQ);
            //if(this.isDragQ){
            //    document.getElementById("dragBtn").innerHTML = 'Drag';
            //} else {
            //    document.getElementById("dragBtn").innerHTML = 'Spin';
            //}
        };
        Canvas3D.prototype._setShapesFromPoly = function () {
            var C = this.poly.getSolid();
            var i = 0;
            while (i < C.length) {
                var surf = C[i];
                this.addShape3D("surface", this.coords2Lines(surf, this.poly.scale), 1, "#fff", "rgba(0, 255, 0, 0.3)");
                i++;
            }
            this.setClrs(this.getClrType());
        };
        Canvas3D.prototype.coords2Lines = function (surf, scale) {
            var P = [], toNum;
            var midPt = [0, 0, 0]; //mid point
            for (var i = 0; i < surf.length; i++) {
                if (i < surf.length - 1) {
                    toNum = i + 1;
                }
                else {
                    toNum = 0;
                }
                P[i] = [];
                if (surf[i] == undefined) {
                    console.error("Error surface >>> " + i, surf[i]);
                }
                else {
                    for (var j = 0; j < 3; j++) {
                        P[i][j] = surf[i][j] * scale;
                        if (this.isExplode)
                            midPt[j] += P[i][j];
                    }
                }
            }
            if (this.isExplode) {
                for (var j = 0; j < 3; j++) {
                    midPt[j] /= surf.length;
                }
                for (var i = 0; i < surf.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        P[i][j] += midPt[j] / 2;
                    }
                }
            }
            return P;
        };
        Canvas3D.prototype.addShape3D = function (shapeType, pontArray, lineWeight, lineClr, fillClr) {
            var shape = new Shape3D.Shape(this);
            shape.transMatrix = this.transMatrix;
            shape.f = this.f;
            shape.setPts(pontArray);
            shape.shapeType = shapeType;
            shape.lineWeight = lineWeight;
            shape.lineClr = lineClr;
            shape.fillClr = fillClr;
            this.shapes.push(shape);
        };
        Canvas3D.prototype.setClrs = function (clrMethod) {
            for (var i = 0; i < this.shapes.length; i++) {
                var shape = this.shapes[i];
                shape.clrMethod = clrMethod;
                switch (clrMethod) {
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
        };
        Canvas3D.prototype.getClrType = function () {
            if (this.isCurvy || this.isFlat) {
                if (this.shapeName == 'plane') {
                    return "Glass";
                }
                else {
                    return "Shaded";
                }
            }
            else {
                var div = document.getElementById('clrType');
                if (div.selectedIndex == -1)
                    return 'Multi';
                return div.options[div.selectedIndex].text;
            }
        };
        Canvas3D.prototype.setTransMatrix = function (x, y, z, M) {
            var vectorLength = Math.sqrt(x * x + y * y + z * z);
            if (vectorLength > 0.0001) {
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
        };
        Canvas3D.prototype._matrixMatrixMultiple = function (A, B) {
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
        };
        /* EVENT LISTENER */
        Canvas3D.prototype._onTouchStartEvent = function () {
            var self = this;
            this.canvas.addEventListener('touchstart', function (event) {
                self.isDraggingQ = true;
                var touch = event.targetTouches[0];
                var bRect = self.canvas.getBoundingClientRect();
                self.prevMouseX = (touch.clientX - bRect.left) * (self.width / self.ratio / bRect.width);
                self.prevMouseY = (touch.clientY - bRect.top) * (self.height / self.ratio / bRect.height);
            }, false);
        };
        Canvas3D.prototype._onTouchMoveEvent = function () {
            var self = this;
            this.canvas.addEventListener('touchmove', function (event) {
                console.log(event);
                var touch = event.targetTouches[0];
                event.clientX = touch.clientX;
                event.clientY = touch.clientY;
                event.touchQ = true;
                self._onMouseMove(event);
                if (event.defaultPrevented)
                    event.defaultPrevented;
                else if (event.preventDefault)
                    event.preventDefault();
            }, false);
        };
        Canvas3D.prototype._onMouseDownEvent = function () {
            var self = this;
            this.canvas.addEventListener('mousedown', function (event) {
                self.isDraggingQ = true;
                self.prevMouseX = self.mouseX;
                self.prevMouseY = self.mouseY;
            }, false);
        };
        Canvas3D.prototype._onMouseMoveEvent = function () {
            var self = this;
            this.canvas.addEventListener('mousemove', function (event) {
                var bRect = self.canvas.getBoundingClientRect();
                self.mouseX = (event.clientX - bRect.left) * (self.width / self.ratio / bRect.width);
                self.mouseY = (event.clientY - bRect.top) * (self.height / self.ratio / bRect.height);
                if (self.isDragQ) {
                    if (self.isDraggingQ) {
                        self.setTransMatrix(-(self.prevMouseY - self.mouseY) * 3, (self.prevMouseX - self.mouseX) * 3, 0, self.transMatrix);
                        self.prevMouseX = self.mouseX;
                        self.prevMouseY = self.mouseY;
                        self.update();
                    }
                }
                else {
                    self.xAngle = -(self.mouseX - self.width / 2) / 25;
                    self.yAngle = (self.mouseY - self.height / 2) / 25;
                }
            }, false);
        };
        Canvas3D.prototype._onMouseMove = function (event) {
            console.log("asd");
            var self = this;
            var bRect = self.canvas.getBoundingClientRect();
            self.mouseX = (event.clientX - bRect.left) * (self.width / self.ratio / bRect.width);
            self.mouseY = (event.clientY - bRect.top) * (self.height / self.ratio / bRect.height);
            if (self.isDragQ) {
                if (self.isDraggingQ) {
                    self.setTransMatrix(-(self.prevMouseY - self.mouseY) * 3, (self.prevMouseX - self.mouseX) * 3, 0, self.transMatrix);
                    self.prevMouseX = self.mouseX;
                    self.prevMouseY = self.mouseY;
                    self.update();
                }
            }
            else {
                self.xAngle = -(self.mouseX - self.width / 2) / 25;
                self.yAngle = (self.mouseY - self.height / 2) / 25;
            }
        };
        Canvas3D.prototype._onMouseUpEvent = function () {
            var self = this;
            this.canvas.addEventListener('mouseup', function (event) {
                self.isDraggingQ = false;
            }, false);
        };
        return Canvas3D;
    })(System.Canvas);
    System.Canvas3D = Canvas3D;
})(System || (System = {}));
/**
 * Created by madcat on 12/2/15.
 * 3D main generator file code
 */
///<reference path="Canvas3D.ts"/>
var P$;
(function (P$) {
    var canvas;
    function init(opts) {
        var canvasType = opts.canvasType ? opts.canvasType : '3d';
        var width = opts.width ? opts.width : 500;
        var height = opts.height ? opts.height : 500;
        var bgColor = opts.bgColor ? opts.bgColor : "#fff";
        if (canvasType === '3d') {
            var eSize = width / 10;
            if (eSize < 35) {
                eSize = 35;
            }
            var eSizeEM = eSize / 16; // em
            var explodeSpace = 10 + eSize + 30;
            var s = "";
            s += '<div id="PI" style="position:relative; width:' + width + 'px; height:' + height + 'px; background-color: ' + bgColor + ';margin: 0 auto;">';
            s += '<canvas id="canvasId" width="' + width + '" height="' + height + '" style=" margin:auto; display:block; border: 2px solid #000; padding : 3px;z-index:1;"></canvas>';
            //s += '<button id="dragBtn" onclick="P$.toggleDrag()" style="" class="togglebtn lo" >Drag</button>';
            s += '<a href="javascript:void(0)" onclick="P$.toggleDrag()" class="togglebtn hi" style="display:block; width: ' + eSizeEM / 2.5 + 'em; height : ' + eSizeEM / 2.5 + 'em;font-size: ' + eSizeEM + 'em;  top: 10px; left: 10px;z-index:2;" id="dragBtn"><i class="icon-pointer32"></i></a>';
            //s += '<button id="explodeBtn" onclick="P$.toggleExplode()" style="" class="togglebtn lo" ></button>';
            s += '<a href="javascript:void(0)" onclick="P$.toggleExplode()" class="togglebtn lo" style="display:block; width: ' + eSizeEM / 2.5 + 'em; height : ' + eSizeEM / 2.5 + 'em;font-size: ' + eSizeEM + 'em; left: ' + explodeSpace + 'px; top: 10px;z-index:2;" id="explodeBtn"><i class="icon-bombs1"></i></a>';
            s += '<div style="position: absolute; top: 3px; right: 5px; font: 18px Arial; z-index: 2">';
            s += "Color: ";
            s += _getDropDownHTML(['Multi', 'Shaded', 'Two', 'Glass', 'PureGlass', 'Beams'], 'P$.clrChg', 'clrType');
            s += '</div>';
            s += '</div>';
            document.getElementById(opts.parentId).insertAdjacentHTML('afterbegin', s);
            //document.write(s);
            var canvas3d = new System.Canvas3D(document.getElementById('canvasId'));
            canvas = canvas3d;
            canvas3d.polyhedraMain(opts.shapeName);
        }
        else {
        }
    }
    P$.init = init;
    //var toggleDrag = ;
    //var toggleExplode = ;
    //var clrChg = canvas3d.clrChg.bind(canvas3d);
    function toggleDrag() {
        canvas.toggleDrag.bind(canvas)();
    }
    P$.toggleDrag = toggleDrag;
    function toggleExplode() {
        canvas.toggleExplode.bind(canvas)();
    }
    P$.toggleExplode = toggleExplode;
    function clrChg() {
        canvas.clrChg.bind(canvas)();
    }
    P$.clrChg = clrChg;
    function _getDropDownHTML(opts, funcName, id) {
        var s = '';
        s += '<select id="' + id + '" style="font: 18px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px;z-index:2;" onchange="' + funcName + '()">';
        for (var i = 0; i < opts.length; i++) {
            var idStr = id + i;
            var chkStr = i == 99 ? 'checked' : '';
            s += '<option id="' + idStr + '" value="' + opts[i] + '" style="height:18px;" ' + chkStr + ' >' + opts[i] + '</option>';
        }
        s += '</select>';
        return s;
    }
})(P$ || (P$ = {}));
/**
 * Created by madcat on 12/1/15.
 */
///<reference path="system/P$.ts"/>
P$.init({
    parentId: 'canvas',
    shapeName: 'dodecahedron'
});
