/**
 * Created by madcat on 12/1/15.
 */

///<reference path="../Poly.ts"/>

module Shape3D {
    export class Cylinder{

        public static createNCylinder(ngon){
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
        }
    }
}