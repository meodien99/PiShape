/**
 * Created by madcat on 11/30/15.
 */
///<reference path="Shape.ts"/>
///<reference path="Polies/Cylinder.ts"/>
///<reference path="Polies/Cone.ts"/>
///<reference path="Polies/Cube.ts"/>
///<reference path="Polies/Sphere.ts"/>

module Shape3D {
    export class Poly extends Shape {

        scale : number = 90;
        shapeType:string = 'cube';
        shapeSource:string = 'calc';

        public getSolid() {
            var C = [];
            switch (this.shapeSource){
                case "calc":
                    C = this.getCalcSolid();
                    break;
                default:
            }
            return C;
        }

        public getCalcSolid() {
            var C = [];
            this.scale = 90;
            var i, j;

            switch (this.shapeType.toLowerCase()){
                case "net" :
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
                    C = Cone.createCone();
                    this.scale = 140;
                    this.clrMethod = "Smooth";
                    break;
                case "square-pyramid":
                    C = Cone.createSquarePyramid();
                    this.scale = 180;
                    break;
                case "pent-pyramid":
                    C = Cone.createPentPyramid();
                    this.scale = 180;
                    break;
                //Tetrahedron ( triangular pyramid with three congruent equilateral for each of its faces)
                case "tetrahedron":
                    C = Cone.createTetrahedron();
                    break;
                case"irr-tetrahedron":
                    C = Cone.createIrrTetrahedron();
                    this.scale = 80;
                    break;
                //Cylinder
                case "cylinder":
                    C = Cylinder.createNCylinder(10);
                    break;
                case"tri-prism-n":
                    C = Cylinder.createTriPrismN();
                    this.scale = 100;
                    break;
                case"tri-prism":
                    C = Cylinder.createTriPrism();
                    break;
                //Cube
                case "cube":
                    C = Cube.createCube();
                    break;
                case"cuboid":
                case"rect-prism":
                    C = Cube.createCuboid();
                    break;
                case"pent-prism":
                    C = Cube.createPentPrism();
                    break;
                case"strange-prism":
                    break;

                //octahedron
                case"octahedron":
                    C = Sphere.createOctahedron();
                    this.scale = 50;
                    break;
                case"dodecahedron":
                    C = Sphere.createDodecahedron();
                    break;
                case"icosahedron-intersected":
                    C = Sphere.createIcosahedronIntersected();
                    break;
                case"icosahedron":
                    C = Sphere.createIcosahedron();
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
                default :
            }
            return C;
        }
    }
}