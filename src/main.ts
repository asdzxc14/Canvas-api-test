window.onload = () => {

    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    //1   0   50
    //0   1   50
    //0   0   1 

    var stage = new DisplayObjectContainer();

    setInterval(() => {

        context2D.clearRect(0, 0, canvas.width, canvas.height);//在显示图片之前清屏
        stage.draw(context2D);

    }, 100)

    var tf1 = new TextField();
    tf1.text = "Zero";
    tf1.x = 40;
    tf1.y = 50;
    tf1.size = 20;
    tf1.alpha = 0.1;
    stage.addChild(tf1);

    var tf2 = new TextField();
    tf2.text = "9";
    tf2.x = 100;
    tf2.y = 50;
    tf2.size = 30;
    stage.addChild(tf2);

    var image = document.createElement("img");
    image.src = "DC334.jpg";

    var bitmap = new Bitmap();
    bitmap.image = image;
    bitmap.width = 300;
    bitmap.height = 300;
    bitmap.x = 10;
    bitmap.y = 70;
    bitmap.alpha = 0.7;
    stage.addChild(bitmap);

};

interface Drawable {

    draw(context2D: CanvasRenderingContext2D);
    remove();
}

class DisplayObject implements Drawable {

    x = 0;
    y = 0;
    alpha = 1;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;
    globalAlpha = 1;
    parent: DisplayObject = null;
    matrix: math.Matrix = null;

    remove() { };

    constructor() {

        this.matrix = new math.Matrix();
    }

    draw(context2D: CanvasRenderingContext2D) {

        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {

            this.matrix = math.matrixAppendMatrix(this.matrix, this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        } else {

            this.globalAlpha = this.alpha;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);

        this.render(context2D);

    }

    render(context2D: CanvasRenderingContext2D) { }
}

class DisplayObjectContainer implements Drawable {

    array: Drawable[] = [];

    x = 0;
    y = 0;
    alpha = 1;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;
    globalAlpha = 1;
    parent: DisplayObjectContainer = null;
    matrix = null;

    remove() { };

    constructor() {

        this.matrix = new math.Matrix();
    }

    draw(context2D: CanvasRenderingContext2D) {

        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            
            this.matrix = math.matrixAppendMatrix(this.matrix, this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        } else {

            this.globalAlpha = this.alpha;
        }

        for (let drawable of this.array) {

            drawable.draw(context2D);
        }
    }

    render() { }

    addChild(displayObject: DisplayObject) {

        this.removeChild(displayObject);
        this.array.push(displayObject);
        displayObject.parent = this;
    }

    removeChild(child: Drawable) {

        var tempArr = this.array.concat();

        for (let each of tempArr) {

            if (each == child) {

                var index = this.array.indexOf(child);
                tempArr.splice(index, 1);
                this.array = tempArr;
                child.remove();
                break;
            }
        }
    }
}

class TextField extends DisplayObject {

    text = "";
    size = 50;
    font = "Arial";

    render(context2D:CanvasRenderingContext2D) {

        context2D.font = this.size +"px" + " " + this.font;
        context2D.fillText(this.text,0,0);
    }
}

class Bitmap extends DisplayObject {

    image: HTMLImageElement = null;
    width: number;
    height: number;

    constructor() {
        super();
    }

    render(context2D:CanvasRenderingContext2D) {

        context2D.drawImage(this.image,0,0,this.width,this.height);          
    }
}

module math {


    export class Point {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export function pointAppendMatrix(point: Point, m: Matrix): Point {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);

    }

    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    export function invertMatrix(m: Matrix): Matrix {


        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;

        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }

        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;

    }

    export function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix {

        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD: number = Math.PI / 180;


    export class Matrix {

        constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        public a: number;

        public b: number;

        public c: number;

        public d: number;

        public tx: number;

        public ty: number;

        public toString(): string {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        }

        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;

            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;

        }
    }
}
