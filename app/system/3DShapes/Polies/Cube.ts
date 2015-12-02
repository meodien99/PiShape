/**
 * Created by madcat on 12/1/15.
 */
module Shape3D {
    export class Cube{

        public static createCube(){
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
        }

        public static createCuboid(){
            var a = 1.2,
            b = 0.7,
            c = 0.7;

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
        }

        //penta prism
        public static createPentPrism(){
            var a = 1.2,
            b = 0.70,
            c = 0.73,
            d = 0.16,
            e = 0.44;

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
        }

        public static createStrangePrism(){
            var a = 1.2,
            b = 0.7,
            c = 0.7;

            var D = [[[-a, -b, -c], [a, -b, -c], [a, -b, c]], [[-a, -b, -c], [-a, -b, c], [-a, b, c]], [[-a, -b, c], [a, -b, c], [a, b, c]], [[-a, b, -c], [-a, b, c], [a, b, c]], [[a, -b, -c], [a, b, -c], [a, b, c]], [[-a, -b, -c], [-a, b, -c], [a, b, -c]]];
            return D;
        }
    }
}