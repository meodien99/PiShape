/**
 * Created by madcat on 11/30/15.
 * Point 3D class
 */
///<reference path="../2DShapes/Pt2d.ts"/>

module Shape3D {
    export class Pt3d extends Shape2D.Pt2d{
        z: number = 0;

        constructor(){
            super();
        }

        public setMe(x:number, y:number, z:number):void {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public addPoint2Me(point : Pt3d, factor?){
            factor = typeof  factor !== 'undefined' ? factor : 1;
            if(factor === 1){
                this.x += point.x;
                this.y += point.y;
                this.z += point.z;
            } else {
                this.x += point.x * factor;
                this.y += point.y * factor;
                this.z += point.z * factor;
            }
        }
    }
}
