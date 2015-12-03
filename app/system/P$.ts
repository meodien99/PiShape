/**
 * Created by madcat on 12/2/15.
 * 3D main generator file code
 */

///<reference path="Canvas3D.ts"/>

module P$ {

    interface P$Options {
        parentId : string;
        width? : number;
        height? : number;
        bgColor? : string;
        shapeName : string;
        canvasType? : string;
    }

    var canvas;

    export function init(opts : P$Options){
        var canvasType = opts.canvasType ? opts.canvasType : '3d';
        var width = opts.width ? opts.width : 500;
        var height = opts.height ? opts.height : 500;
        var bgColor = opts.bgColor ? opts.bgColor : "#fff";
        if(canvasType === '3d'){
            var eSize = width / 10;
            if(eSize < 35){
                eSize = 35;
            }
            var eSizeEM = eSize / 16; // em
            var explodeSpace = 10 + eSize + 30;
            var s = "";
            s += '<div id="PI" style="position:relative; width:' + width + 'px; height:' + height + 'px; background-color: '+ bgColor +';margin: 0 auto;">';
            s += '<canvas id="canvasId" width="' + width + '" height="' + height + '" style=" margin:auto; display:block; border: 2px solid #000; padding : 3px;z-index:1;"></canvas>';
            //s += '<button id="dragBtn" onclick="P$.toggleDrag()" style="" class="togglebtn lo" >Drag</button>';
            s += '<a href="javascript:void(0)" onclick="P$.toggleDrag()" class="togglebtn hi" style="display:block; width: '+ eSizeEM/2.5 +'em; height : ' + eSizeEM/2.5 + 'em;font-size: ' + eSizeEM + 'em;  top: 10px; left: 10px;z-index:2;" id="dragBtn"><i class="icon-pointer32"></i></a>'

            //s += '<button id="explodeBtn" onclick="P$.toggleExplode()" style="" class="togglebtn lo" ></button>';
            s += '<a href="javascript:void(0)" onclick="P$.toggleExplode()" class="togglebtn lo" style="display:block; width: '+ eSizeEM/2.5 +'em; height : ' + eSizeEM/2.5 + 'em;font-size: ' + eSizeEM + 'em; left: ' + explodeSpace + 'px; top: 10px;z-index:2;" id="explodeBtn"><i class="icon-bombs1"></i></a>'

            s += '<div style="position: absolute; top: 3px; right: 5px; font: 18px Arial; z-index: 2">';
            s += "Coloring: ";
            s += _getDropDownHTML(['Multi', 'Shaded', 'Two', 'Glass', 'PureGlass', 'Beams'], 'P$.clrChg', 'clrType');
            s += '</div>';

            s += '</div>';

            document.getElementById(opts.parentId).insertAdjacentHTML('afterbegin', s);
            //document.write(s);
            var canvas3d = new System.Canvas3D(<HTMLCanvasElement> document.getElementById('canvasId'));
            canvas = canvas3d;

            canvas3d.polyhedraMain(opts.shapeName);
        } else {
            //2d
        }
    }



    //var toggleDrag = ;
    //var toggleExplode = ;
    //var clrChg = canvas3d.clrChg.bind(canvas3d);


    export function toggleDrag(){
        canvas.toggleDrag.bind(canvas)();
    }

    export function toggleExplode(){
        canvas.toggleExplode.bind(canvas)();
    }

    export function clrChg() {
        canvas.clrChg.bind(canvas)();
    }

    function _getDropDownHTML(opts:Array<string>, funcName:string, id:string){
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
}