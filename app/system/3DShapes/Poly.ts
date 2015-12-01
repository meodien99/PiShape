/**
 * Created by madcat on 11/30/15.
 */
///<reference path="Shape.ts"/>

module Shape3D {

    export class Poly extends Shape{

        scale : number = 90;

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
                case "cone":
                    C = this.createNCone(60, 1.3);
                    this.scale = 140;
                    this.clrMethod = "Smooth";
                    break;
            }

            return C;
        }

        public createNCone(ngon, ht) {
            var D = [];

            D[0] = [];
            var sumx = 0;
            var sumy = 0;
            for(var i = 0; i < ngon; i++){
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

            for( i = 0; i < ngon; i++){
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
                if(i1 == ngon)
                    i1 = 0;
                D[n][2] = [];
                D[n][2][0] = D[0][i1][0];
                D[n][2][1] = D[0][i1][1];
                D[n][2][2] = D[0][i1][2];
            }

            return D;
        }

    }
}