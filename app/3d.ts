/**
 * Created by madcat on 12/1/15.
 */
///<reference path="system/Canvas3D.ts"/>

function initCanvas(){
    this.width = 500;
    this.height = 500;

    var s = "";
    s += '<div style="position:rcanvasative; width:' + this.width + 'px; height:' + this.height + 'px; border: 1px solid blue; border-radius: 10px;  margin:auto; display:block;">';
    s += '<canvas id="canvasId" width="' + this.width + '" height="' + this.height + '" style="z-index:1;"></canvas>';
    s += '<button id="dragBtn" onclick="toggleDrag()" style="z-index:2; position: absolute; top: 3px; left: 3px;" class="togglebtn lo" >Drag</button>';
    if (this.isCurvy || this.isFlat) {
    } else {
        s += '<button id="explodeBtn" onclick="toggleExplode()" style="z-index:2; position: absolute; top: 3px; left: 70px;" class="togglebtn lo" >Explode</button>';
        s += '<div style="position: absolute; top: 3px; right: 5px; font: 18px Arial;">';
        s += "Coloring: ";
        s += _getDropdownHTML(['Multi', 'Shaded', 'Two', 'Glass', 'PureGlass', 'Beams'], 'clrChg', 'clrType');
        s += '</div>';
    }
    s += '</div>';
    document.write(s);
}

function _getDropdownHTML(opts:Array<string>, funcName:string, id:string){
    var s = '';
    s += '<select id="' + id + '" style="font: 18px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px;" onchange="' + funcName + '()">';
    for (var i = 0; i < opts.length; i++) {
        var idStr = id + i;
        var chkStr = i == 99 ? 'checked' : '';
        s += '<option id="' + idStr + '" value="' + opts[i] + '" style="height:18px;" ' + chkStr + ' >' + opts[i] + '</option>';
    }
    s += '</select>';
    return s;
}
initCanvas();
var canvas3d = new System.Canvas3D(<HTMLCanvasElement> document.getElementById('canvasId'));

var toggleDrag = canvas3d.toggleDrag.bind(canvas3d);
var toggleExplode = canvas3d.toggleExplode.bind(canvas3d);
var clrChg = canvas3d.clrChg.bind(canvas3d);
canvas3d.polyhedraMain('cone');