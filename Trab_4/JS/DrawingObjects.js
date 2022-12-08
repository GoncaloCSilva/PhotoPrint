class DrawingObjects
{
    constructor (px, py, name) {
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }

        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method draw.");
        }

        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method mouseOver.");
        }

        this.posx = px;
        this.posy = py;
        this.name = name;
    }

    draw (cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method draw from child.");
    }

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }


    sqDist(px1, py1, px2, py2) {
        let xd = px1 - px2;
        let yd = py1 - py2;

        return ((xd * xd) + (yd * yd));
    }
}

class Heart extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'H');
        this.h = w * 0.7;
        this.drx = w / 4;
        this.radsq = this.drx * this.drx;
        this.ang = .25 * Math.PI;
        this.color = c;
    }

    outside (x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }

    draw (cnv) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let cx = rightctrx + this.drx * Math.cos(this.ang);
        let cy = this.posy + this.drx * Math.sin(this.ang);
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
        ctx.lineTo(this.posx, this.posy + this.h);
        ctx.lineTo(cx,cy);
        ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    mouseOver (mx, my) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let qx = this.posx - 2 * this.drx;
        let qy = this.posy - this.drx;
        let qwidth = 4 * this.drx;
        let qheight = this.drx + this.h;

        let x2 = this.posx;
        let y2 = this.posy + this.h;
        let m = (this.h) / (2 * this.drx);

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist (mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }
    }
}

class Amogus extends DrawingObjects
{

    constructor (px, py, w, h, c) {
        super(px, py, 'A');
        this.w = w;
        this.h = h;
        this.color = c;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.lineWidth = 5;
        //ctx.fillRect(this.posx, this.posy, this.w, this.h);
         //Body
        ctx.moveTo(this.posx,this.posy);
        ctx.lineTo(this.posx+125,this.posy);
        ctx.arc(this.posx+125,this.posy+10,10,Math.PI*1.5,Math.PI*2,false);
        ctx.lineTo(this.posx+135,this.posy+240);
        //Legs
        ctx.arc(this.posx+125,this.posy+240,10,0,Math.PI/2,false)
        ctx.lineTo(this.posx+100,this.posy+250)
        ctx.arc(this.posx+100,this.posy+240,10,Math.PI/2,Math.PI,false)
        ctx.lineTo(this.posx+90,this.posy+200)
        
        ctx.lineTo(this.posx+30,this.posy+200)

        ctx.lineTo(this.posx+30,this.posy+240)
        ctx.arc(this.posx+20,this.posy+240,10,0,Math.PI/2,false)
        ctx.lineTo(this.posx,this.posy+250)
        ctx.arc(this.posx,this.posy+240,10,Math.PI/2,Math.PI,false)

        //Body
        ctx.lineTo(this.posx-10,this.posy+10)
        ctx.arc(this.posx,this.posy+10,10,Math.PI,Math.PI*1.5,false);

        //Back
        ctx.moveTo(this.posx-10,this.posy+70);
        ctx.lineTo(this.posx-10,this.posy+150);
        ctx.lineTo(this.posx-40,this.posy+150);
        ctx.lineTo(this.posx-40,this.posy+70);
        ctx.lineTo(this.posx-10,this.posy+70);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        //Eyes
        ctx.beginPath();
        ctx.fillStyle = "rgb(135, 206, 235)"
        ctx.moveTo(this.posx+135,this.posy+105);
        ctx.ellipse(this.posx+80,this.posy+60,55,35,0,0,Math.PI*2,false);

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        //ctx.fillRect(this.posx+100, this.posy,50,250)
        



    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx+135)) && (my >= this.posy) && (my <= (this.posy+240)));
    }
}

class Text extends DrawingObjects
{
    constructor (px, py, text,color) {
        super(px, py, 'T');
        this.text = text;
        this.color = color;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.font = "25px Arial";
        ctx.fillText(this.text,this.posx,this.posy);
        //ctx.fillRect(this.posx+100, this.posy,50,250)
    }

    mouseOver(mx, my) {
        let a = this.text.length
        return ((mx >= this.posx) && (mx <= (this.posx + a*10)) && (my >= this.posy-10) && (my <= this.posy + 10));
    }
}

class Oval extends DrawingObjects
{
    constructor (px, py, r, hs, vs, c) {
        super(px, py, 'O');
        this.r = r;
        this.radsq = r * r;
        this.hor = hs;
        this.ver = vs;
        this.color = c;
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        return (this.sqDist(x1,y1,x2,y2) <= (this.radsq));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.save();
        ctx.translate(this.posx,this.posy);
        ctx.scale(this.hor,this.ver);
        ctx.fillStyle = this.color;
        ctx.beginPath();
       
        ctx.arc(50, -100, this.r,Math.PI, 2*Math.PI, true);
        ctx.lineTo(50, -100);
        ctx.arc(0, 0, this.r, 0, 2*Math.PI, true);
      
       
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class Picture extends DrawingObjects
{

    constructor (px, py, w, h, impath) {
        super(px, py, 'P');
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
           //ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            ctx.drawImage(this.imgobj, this.posx, this.posy);
            console.log("Debug: N Time");

        } else {
            console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy);
                //ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.imgobj.width)) && (my >= this.posy) && (my <= (this.posy + this.imgobj.height)));
    }
}

class Ghost extends DrawingObjects
{
    constructor (px, py,c) {
        super(px, py, 'G');
        this.color = c;
    }

    mouseOver (mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx +130)) && (my >= this.posy) && (my <= (this.posy + 90)));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.save();
       
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx+65, this.posy+70);

        //Left Down Side x-> +65 y-> +70
        ctx.lineTo(this.posx + 45, this.posy + 90);
        ctx.lineTo(this.posx + 20, this.posy +70 );
        ctx.lineTo(this.posx, this.posy + 90);
        ctx.lineTo(this.posx, this.posy+110);
        //Upper Side
        //ctx.arc(this.posx-35,this.posy-40,30,Math.PI,Math.PI*1.5,false);
        ctx.arcTo(this.posx,this.posy,this.posx+65,this.posy,30);
        ctx.lineTo(this.posx+100,this.posy);
        ctx.arcTo(this.posx+130,this.posy,this.posx+130,this.posy+30,30);
        //ctx.arc(this.posx+35,this.posy-40,30,Math.PI*1.5,0,false);
        //Right Down Side
        ctx.lineTo(this.posx+130,this.posy+90);
        ctx.lineTo(this.posx+110,this.posy+70);
        ctx.lineTo(this.posx+90,this.posy+90);
        //Left Eye
        ctx.moveTo(this.posx+30, this.posy +35);
        ctx.arc(this.posx+30,this.posy+35,15,0,Math.PI*2,true);
        ctx.moveTo(this.posx+25, this.posy+40);
        ctx.arc(this.posx+25,this.posy+40,5,0,Math.PI*2,false);
        //Right Eye
        ctx.moveTo(this.posx+100, this.posy + 35);
        ctx.arc(this.posx+100,this.posy+35,15,0,Math.PI*2,true);
        ctx.moveTo(this.posx+105, this.posy+40);
        ctx.arc(this.posx+105,this.posy+40,5,0,Math.PI*2,false);

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
class PacMan extends DrawingObjects{
    constructor (px, py, c) {
        super(px, py, 'C');
        this.color = c;
    }

    outside (x, y, w, h, mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + 150)) && (my >= this.posy) && (my <= (this.posy + 150)));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 5;
        ctx.arc(this.posx,this.posy,70,(Math.PI/180) *30,(Math.PI/180) *330,false);
        ctx.lineTo(this.posx,this.posy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.moveTo(this.posx+25,this.posy-45);
        ctx.arc(this.posx+10,this.posy-45,12,0,(Math.PI/180) *360,true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
       
        
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx);
        let y2 = (my - this.posy);

        return (this.sqDist(x1,y1,x2,y2) <= (70*70));
    }
} 

class Bear extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'B');
        this.h = w * 0.7;
        this.drx = w / 4;
        this.radsq = this.drx * this.drx;
        this.ang = .25 * Math.PI;
        this.color = c;
    }

    outside (x, y, w, h, mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + 150)) && (my >= this.posy) && (my <= (this.posy + 150)));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = "Black";
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        //Black Rectangle
        ctx.fillRect(this.posx,this.posy,150,150);
        //Bear Head
        ctx.fillStyle = this.color;
        ctx.moveTo(this.posx+75,this.posy+75);
        ctx.arc(this.posx+75,this.posy+75,60,0,Math.PI*2,true);  
        //Bear Left Ear
        ctx.moveTo(this.posx+15,this.posy+15);
        ctx.arc(this.posx+30,this.posy+30,20,0,Math.PI*2,true);
        ctx.moveTo(this.posx+30,this.posy+30);
        ctx.arc(this.posx+30,this.posy+30,10,0,Math.PI*2,false);
        //Bear Right Ear
        ctx.moveTo(this.posx+135,this.posy+15);
        ctx.arc(this.posx+120,this.posy+30,20,0,Math.PI*2,true);
        ctx.moveTo(this.posx+120,this.posy+30);
        ctx.arc(this.posx+120,this.posy+30,10,0,Math.PI*2,false);
        //Bear Eyes
        ctx.moveTo(this.posx+55,this.posy+60);
        ctx.arc(this.posx+55,this.posy+60,9,0,Math.PI*2,false);
        ctx.moveTo(this.posx+51,this.posy+55);
        ctx.arc(this.posx+51,this.posy+55,3,0,Math.PI*2,true)

        ctx.moveTo(this.posx+95,this.posy+60);
        ctx.arc(this.posx+95,this.posy+60,9,0,Math.PI*2,false);
        ctx.moveTo(this.posx+91,this.posy+55);
        ctx.arc(this.posx+91,this.posy+55,3,0,Math.PI*2,true);

        //Bear Nose
        ctx.moveTo(this.posx+75,this.posy+85);
        ctx.ellipse(this.posx+75,this.posy+85,20,15,0,0,Math.PI*2,false);
        ctx.moveTo(this.posx+70,this.posy+80);
        ctx.arc(this.posx+64,this.posy+78,4,0,Math.PI*2,true);

        ctx.closePath();
        ctx.fill();

        //Bear Mouth
        ctx.beginPath();
        ctx.moveTo(this.posx+75,this.posy+100);
        ctx.arcTo(this.posx+75, this.posy+160, this.posx+150,this.posy+10, 15); 
        ctx.moveTo(this.posx+75,this.posy+100);
        ctx.arcTo(this.posx+75, this.posy+160, this.posx,this.posy+10, 15);
        ctx.stroke();     


        ctx.closePath();
        ctx.fill();
        
    }

    mouseOver (mx, my) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let qx = this.posx - 2 * this.drx;
        let qy = this.posy - this.drx;
        let qwidth = 4 * this.drx;
        let qheight = this.drx + this.h;

        let x2 = this.posx;
        let y2 = this.posy + this.h;
        let m = (this.h) / (2 * this.drx);

       
        return ((mx >= this.posx) && (mx <= (this.posx + 150)) && (my >= this.posy) && (my <= (this.posy + 150)));
       

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist (mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }



    }
}