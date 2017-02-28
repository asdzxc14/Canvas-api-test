var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
window.onload = function () {
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    //1   0   50
    //0   1   50
    //0   0   1 
    var stage = new DisplayObjectContainer();
    setInterval(function () {
        context2D.save();
        context2D.clearRect(0, 0, canvas.width, canvas.height); //在显示图片之前清屏
        stage.draw(context2D);
        context2D.restore();
    }, 100);
    var tf1 = new TextField();
    tf1.text = "Zero059";
    tf1.x = 40;
    tf1.y = 50;
    tf1.size = 50;
    tf1.alpha = 1;
    tf1.addEventListener(TouchEventType.MOUSE_TAP, function () {
        tf1.text = "love";
    }, _this, false);
    var image = document.createElement("img");
    image.src = "DC334.jpg";
    image.onload = function () {
        var bitmap = new Bitmap();
        bitmap.image = image;
        bitmap.width = 300;
        bitmap.height = 300;
        bitmap.x = 10;
        bitmap.y = 70;
        bitmap.alpha = 1;
        stage.touchable = true;
        tf1.touchable = true;
        bitmap.touchable = true;
        stage.addChild(tf1);
        stage.addChild(bitmap);
        bitmap.addEventListener(TouchEventType.MOUSE_MOVE, function () {
            console.log("move");
            var manager = Event_Manager.getInstance();
            stage.y += manager.currentY - manager.lastY;
        }, _this, false);
    };
    Event_Manager.eventManager = new Event_Manager();
    Event_Manager.getWindow(window);
    Event_Manager.getStage(stage);
    Event_Manager.getInstance().onMouseDown();
    Event_Manager.getInstance().onMouseMove();
    Event_Manager.getInstance().onMouseUp();
};
var TouchEventType = {
    MOUSE_DOWN: 0,
    MOUSE_MOVE: 1,
    MOUSE_UP: 2,
    MOUSE_TAP: 3
};
var Event_ = (function () {
    function Event_(type, eventFunction, target, ifCapture) {
        this.type = null;
        this.ifCapture = false;
        this.eventFunction = null;
        this.target = null;
        this.type = type;
        this.eventFunction = eventFunction;
        this.target = target;
        this.ifCapture = ifCapture;
    }
    return Event_;
}());
var Event_Manager = (function () {
    function Event_Manager() {
        this.displayObjcetArray = [];
        //记录位置
        this.currentX = null;
        this.currentY = null;
        this.lastX = null;
        this.lastY = null;
        this.isMouseDown = false; //检测鼠标是否按下
        this.window = null;
        this.stage = null;
    }
    Event_Manager.getInstance = function () {
        if (Event_Manager.eventManager == null) {
            Event_Manager.eventManager = new Event_Manager();
            Event_Manager.eventManager.displayObjcetArray = new Array();
            return Event_Manager.eventManager;
        }
        else {
            return Event_Manager.eventManager;
        }
    };
    Event_Manager.getWindow = function (window) {
        Event_Manager.getInstance().window = window;
    };
    Event_Manager.getStage = function (stage) {
        Event_Manager.getInstance().stage = stage;
    };
    Event_Manager.prototype.onMouseDown = function () {
        var manager = Event_Manager.getInstance();
        manager.window.onmousedown = function (e) {
            manager.isMouseDown = true;
            manager.displayObjcetArray.splice(0, manager.displayObjcetArray.length);
            manager.hitResult = manager.stage.hitTest(e.offsetX, e.offsetY);
            manager.currentX = e.offsetX;
            manager.currentY = e.offsetY;
        };
    };
    Event_Manager.prototype.onMouseMove = function () {
        var manager = Event_Manager.getInstance();
        manager.window.onmousemove = function (e) {
            if (manager.currentX == null) {
                manager.currentX = e.offsetX;
                manager.currentY = e.offsetY;
                manager.lastX = manager.currentX;
                manager.lastY = manager.currentY;
            }
            else {
                manager.lastX = manager.currentX;
                manager.lastY = manager.currentY;
                manager.currentX = e.offsetX;
                manager.currentY = e.offsetY;
            }
            if (manager.isMouseDown) {
                for (var i = 0; i < manager.displayObjcetArray.length; i++) {
                    for (var _i = 0, _a = manager.displayObjcetArray[i].eventList; _i < _a.length; _i++) {
                        var event_1 = _a[_i];
                        if (event_1.type == TouchEventType.MOUSE_MOVE && event_1.ifCapture) {
                            event_1.eventFunction(e);
                        }
                    }
                }
                for (var i = (manager.displayObjcetArray.length - 1); i >= 0; i--) {
                    for (var _b = 0, _c = manager.displayObjcetArray[i].eventList; _b < _c.length; _b++) {
                        var event_2 = _c[_b];
                        if (event_2.type == TouchEventType.MOUSE_MOVE && !event_2.ifCapture) {
                            event_2.eventFunction(e);
                        }
                    }
                }
            }
        };
    };
    Event_Manager.prototype.onMouseUp = function () {
        var manager = Event_Manager.getInstance();
        manager.window.onmouseup = function (e) {
            manager.isMouseDown = false;
            manager.displayObjcetArray.splice(0, manager.displayObjcetArray.length);
            var newHitRusult = manager.stage.hitTest(e.offsetX, e.offsetY);
            for (var i = manager.displayObjcetArray.length - 1; i >= 0; i--) {
                for (var _i = 0, _a = manager.displayObjcetArray[i].eventList; _i < _a.length; _i++) {
                    var event_3 = _a[_i];
                    if (event_3.type == TouchEventType.MOUSE_TAP && newHitRusult == manager.hitResult) {
                        console.log("mouse up");
                        event_3.eventFunction(e);
                    }
                }
            }
        };
    };
    return Event_Manager;
}());
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.globalAlpha = 1;
        this.parent = null;
        this.matrix = null;
        this.eventList = [];
        this.touchable = false;
        this.matrix = new math.Matrix();
    }
    DisplayObject.prototype.removeParent = function () {
        this.parent = null;
    };
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.matrix = math.matrixAppendMatrix(this.matrix, this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        }
        else {
            this.globalAlpha = this.alpha;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);
        this.render(context2D);
    };
    DisplayObject.prototype.render = function (context2D) { };
    DisplayObject.prototype.hitTest = function (x, y) {
        return null;
    };
    DisplayObject.prototype.addEventListener = function (type, eventFunction, target, ifCapture) {
        var e = new Event_(type, eventFunction, target, ifCapture);
        this.eventList.push(e);
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super.call(this) || this;
        _this.array = [];
        return _this;
    }
    DisplayObjectContainer.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.matrix = math.matrixAppendMatrix(this.matrix, this.parent.matrix);
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
        }
        else {
            this.globalAlpha = this.alpha;
        }
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.render = function () { };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        if (!this.touchable) {
            return null;
        }
        for (var i = this.array.length - 1; i >= 0; i--) {
            var child = this.array[i];
            var pointBaseOnChild = math.pointAppendMatrix(new math.Point(x, y), math.invertMatrix(child.matrix));
            var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.removeChild(displayObject);
        this.array.push(displayObject);
        displayObject.parent = this;
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        var tempArr = this.array.concat();
        for (var _i = 0, tempArr_1 = tempArr; _i < tempArr_1.length; _i++) {
            var each = tempArr_1[_i];
            if (each == child) {
                var index = this.array.indexOf(child);
                tempArr.splice(index, 1);
                this.array = tempArr;
                child.removeParent();
                break;
            }
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "";
        _this.size = 50;
        _this.font = "Arial";
        _this.rect = null;
        return _this;
    }
    TextField.prototype.render = function (context2D) {
        this.rect = new math.Rectangle(0, -this.size, this.text.length * this.size / 2, this.size);
        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, 0, 0);
    };
    TextField.prototype.hitTest = function (x, y) {
        if (!this.touchable) {
            return null;
        }
        if (this.rect == null) {
            this.rect = new math.Rectangle(0, -this.size, this.text.length * this.size / 2, this.size);
        }
        var hitPoint = new math.Point(x, y);
        if (this.rect.isPointInRectangle(hitPoint)) {
            if (this.eventList.length != 0) {
                Event_Manager.getInstance().displayObjcetArray.push(this);
            }
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        var _this = _super.call(this) || this;
        _this.image = null;
        _this.rect = null;
        return _this;
    }
    Bitmap.prototype.render = function (context2D) {
        context2D.drawImage(this.image, 0, 0, this.width, this.height);
    };
    Bitmap.prototype.hitTest = function (x, y) {
        if (!this.touchable) {
            return null;
        }
        this.rect = new math.Rectangle(0, 0, this.width, this.height);
        var localHitPoint = new math.Point(x, y);
        if (this.rect.isPointInRectangle(localHitPoint)) {
            if (this.eventList.length != 0) {
                Event_Manager.getInstance().displayObjcetArray.push(this);
            }
            return this;
        }
        else {
            return null;
        }
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
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            var rect = this;
            if (point.x < rect.width + rect.x &&
                point.y < rect.height + rect.y &&
                point.x > rect.x &&
                point.y > rect.y) {
                return true;
            }
        };
        return Rectangle;
    }());
    math.Rectangle = Rectangle;
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