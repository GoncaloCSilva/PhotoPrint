'use strict';

class FotoPrint
{
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.pool = new Pool(100);
    }
    init() {
        let r = new Amogus(30, 10, 20, 20, "red");
        this.pool.insert(r);

        let o = new Ghost(190, 40,"black");
        this.pool.insert(o);

        let h = new Bear(340, 15, 50, "White");
        this.pool.insert(h);

        let dad = new Picture(510, 5, 70, 70, "imgs/allison1.jpg");
        this.pool.insert(dad);

        let pacman = new PacMan(750, 85, "yellow");
        this.pool.insert(pacman);
       
        let heart = new Heart(910, 50, 150, "pink");
        this.pool.insert(heart);
    }

    drawObj(cnv) {
        for (let i = 0; i < this.pool.items.length; i++) {
            this.pool.items[i].draw(cnv);
        }
    }

    dragObj(mx, my) {
        let endpt = this.pool.items.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.pool.items[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.pool.items[i].posx;
                this.offsety = my - this.pool.items[i].posy;
                let item = this.pool.items[i];
                this.thingInMotion = this.pool.items.length - 1;
                this.pool.items.splice(i, 1); //This was commented for a while but it's necessary for obvious reasons
                this.pool.items.push(item);
                return true;
            }
        }
        return false;
    }

    moveObj(mx, my) {
        this.pool.items[this.thingInMotion].posx = mx - this.offsetx;
        this.pool.items[this.thingInMotion].posy = my - this.offsety;
    }

    removeObj () {
        this.pool.remove();
    }

    insertObj (mx, my) {
        let item = null;
        let endpt = this.pool.items.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.pool.items[i].mouseOver(mx,my)) {
                item = this.cloneObj(this.pool.items[i]);
                this.pool.insert(item);
                return true;
            }
        }
        return false;
    }

    selectObj (mx, my) {
        let endpt = this.pool.items.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.pool.items[i].mouseOver(mx,my)) {
                return this.pool.items[i];
            }
        }
        return null;
    }
    
    addObj (draw,color) {
      let a = this.cloneObj(draw);
      a.color = color;
      this.pool.insert(a);
    }

    addSelObj(lastSel,color,mx,my){
        let a = this.cloneObj(lastSel);
        a.color = color;
        a.posx = mx;
        a.posy =my;
        this.pool.insert(a);
    }

    addText(text,color){
        let newText = new Text(50,50,text,color);
        let a = this.cloneObj(newText);
        this.pool.insert(a);
    }
    addImage(image){
        let newImage = new Picture(200,200,200,200,image);
        let a = this.cloneObj(newImage);
        this.pool.insert(a);
    }

    changeColor(draw,color){
        draw.color=color;
    }

    cloneObj (obj) {
        let item = {};

        switch(obj.name) {
            case "A":
                item = new Amogus(obj.posx + 20, obj.posy + 100, obj.w, obj.h, obj.color);
                break;

            case "P":
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.impath);
                break;

            case "G":
                item = new Ghost(obj.posx + 20, obj.posy + 20, obj.color);
                break;

            case "B":
                item = new Bear(obj.posx + 20, obj.posy + 20, obj.drx * 4, obj.color);
                break;
            case "T":
                item = new Text(obj.posx + 20, obj.posy + 20, obj.text, obj.color);
                break;
            case "C":
                item = new PacMan(obj.posx + 20, obj.posy + 20, obj.color);
                break;
            case "H":
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4, obj.color);
                break;
            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }
}


class Pool
{
    constructor (maxSize) {
        this.size = maxSize;
        this.items = [];

    }

    insert (obj) {
        if (this.items.length < this.size) {
            this.items.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove () {
        if (this.items.length !== 0) {
            this.items.pop();
        } else {
           alert("There aren't objects in the application to delete");
        }
    }
}

