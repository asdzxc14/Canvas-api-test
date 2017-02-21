var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    //1   0   50
    //0   1   50
    //0   0   1 
    var stage = new DisplayObjectContainer();
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前清屏
        stage.draw(context2D);
    }, 100);
    var tf1 = new TextField();
    tf1.text = "Hello";
    tf1.x = 40;
    tf1.y = 50;
    tf1.size = 20;
    tf1.alpha = 1;
    stage.addChild(tf1);
    var tf2 = new TextField();
    tf2.text = "World";
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
    bitmap.y = 70;
    bitmap.alpha = 0.8;
    stage.addChild(bitmap);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
    }
    DisplayObject.prototype.draw = function (context2D) {
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.array = [];
    }
    DisplayObjectContainer.prototype.draw = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.array.push(displayObject);
    };
    return DisplayObjectContainer;
}());
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "";
        _this.size = 50;
        _this.font = "Arial";
        return _this;
    }
    TextField.prototype.draw = function (context2D) {
        context2D.globalAlpha = this.alpha;
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, this.x, this.y);
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bitmap.prototype.draw = function (context2D) {
        context2D.globalAlpha = this.alpha;
        context2D.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Bitmap;
}(DisplayObject));
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
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
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
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
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
//# sourceMappingURL=main.js.map