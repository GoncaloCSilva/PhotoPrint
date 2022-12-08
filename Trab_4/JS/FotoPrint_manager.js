'use strict';

let app = null;
let app2 = null;
let clrCanvas = false;
let lastSel = null;

function main() {
    let cnv = document.getElementById('canvas');
    let cnv2 = document.getElementById('canvas2');
    let item = document.getElementById('item');
    let image = document.getElementById('input');
    let clrCanvas = document.getElementById('head2');
    drawCanvasRect(cnv);
    drawCanvasRect(cnv2);

    app = new FotoPrint();
    app.init();
    app.drawObj(cnv);

    app2 = new FotoPrint();
    
    cnv.addEventListener('mousedown', select, false);
    cnv2.addEventListener('dblclick', makenewitem, false);
    cnv2.addEventListener('mousedown',drag,false);   
    item.addEventListener("keyup", drawText, false);
    image.addEventListener('change', drawImage);
    clrCanvas.addEventListener('change',paintCanvas,false)
}

//Draws the rectangle around the canvas
function drawCanvasRect(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

//Draws the rectangle around the canvas and paints the canvas with given color in html
function paintCanvas() {
    let cnv = document.getElementById("canvas2")
    let ctx = cnv.getContext("2d");
    let color = document.getElementById("head2").value;

    ctx.clearRect(0, 0, cnv.width, cnv.height);
   

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(0, 0, cnv.width, cnv.height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
    clrCanvas = true;
    app2.drawObj(cnv);
}

//Drag & Drop operation
//drag
function drag(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas2');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    if (app2.dragObj(mx, my)) {
        app2.drawObj(cnv);
        cnv.addEventListener('mousemove', move, false);
        cnv.addEventListener('mouseup', drop, false);
        cnv.style.cursor="pointer"
    }

}
//Mouse Click Operation
//Selects an object from first canvas
function select(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');
    let cnv2 = document.getElementById('canvas2');
    let color = document.getElementById('head').value;

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    let draw =  app.selectObj(mx, my);
    if (draw!=null) {
        lastSel = draw;
        app2.drawObj(cnv2);
        cnv2.addEventListener("dblclick",drawSelected,false);
    }
}

//Draws the selected object from first canvas on the second canvas
function drawSelected(ev) {
    let mx = null;
    let my = null;
    let cnv2 = document.getElementById('canvas2');
    let color = document.getElementById("head").value;

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv2);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    if (lastSel!=null) {
        if(!clrCanvas) drawCanvasRect(cnv2);
        else paintCanvas(); 
        app2.addSelObj(lastSel,color,mx,my);
        app2.drawObj(cnv2);
    }
    lastSel =null; 

}
//Drag & Drop operation
//move
function move(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas2');
    let cnv2 = document.getElementById('canvas');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    app2.moveObj(mx, my);
   if(!clrCanvas) drawCanvasRect(cnv);
    else paintCanvas(); 
    app2.drawObj(cnv);
    app.drawObj(cnv2);
}

//Drag & Drop operation
//drop
function drop() {
    let cnv = document.getElementById('canvas2');
    let cnv1 = document.getElementById('canvas');

    cnv.removeEventListener('mousemove', move, false);
    cnv.removeEventListener('mouseup', drop, false);
    app2.drawObj(cnv);
    cnv.style.cursor = "crosshair";
   // cnv.addEventListener('mousedown',drag,false);
    //cnv1.addEventListener('mousedown',select,false);
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');
    let cnv2 = document.getElementById('canvas2');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv2);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    if(lastSel == null)
    if (app2.insertObj(mx, my)) {
        if(!clrCanvas) drawCanvasRect(cnv2);
        else paintCanvas();
        app2.drawObj(cnv2);
    }
}

//Delete button
//Onclick Event
function remove() {
    let cnv = document.getElementById('canvas2');

    app2.removeObj();
    if(!clrCanvas) drawCanvasRect(cnv);
    else paintCanvas();
    app2.drawObj(cnv);
}

//Draws the text wrote by the user once he presses "Enter"
function drawText(ev) {
    let cnv = document.getElementById('canvas2');
    let text = document.getElementById('item').value;
    let color = document.getElementById('head').value;
    let keyCode = ev.keyCode;
    if (keyCode === 13){
    app2.addText(text,color);  
    app2.drawObj(cnv);
    }
}

//Draws the image chosen by the user
function drawImage(e) {
    let cnv = document.getElementById('canvas2');
    var img = new Image;
    img.src = URL.createObjectURL(e.target.files[0]);
    app2.addImage(img.src);  
    app2.drawObj(cnv);
}


//Save button
//Onclick Event
function saveasimage() {
    try {
    let link = document.createElement('a');
    link.download = "imagecanvas.png";
    let canvas = document.getElementById("canvas2");
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet- stream");
    link.click();
    } catch (err) {
    alert("You need to change browsers OR upload the file to a server.");
    }
    }


//Mouse Coordinates for all browsers
function getMouseCoord(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
        if (el.tagName === "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            let yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return [xPos,yPos];
}