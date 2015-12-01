/**
 * Created by madcat on 12/1/15.
 */

module Shape3D {
    export class Cone {

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
        public static createNCone(ngon, ht){
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

        public static createCone(){
            return Cone.createNCone(60, 1.3);
        }

        public static createSquarePyramid(){
            return Cone.createNCone(4, 0.5);
        }

        public static createPentPyramid(){
            return Cone.createNCone(5, 0.7);
        }

        public static createTetrahedron(){
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
        }

        public static createIrrTetrahedron(){
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
        }
    }
}