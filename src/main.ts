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
    tf1.text = "Hello";
    tf1.x = 40;
    tf1.y = 50;
    tf1.size = 20;
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
    stage.addChild(bitmap);

};

interface Drawable {

    draw(context2D: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {

    x: number = 0;
    y: number = 0;

    draw(context2D: CanvasRenderingContext2D) {

    }
}

class DisplayObjectContainer implements Drawable {

    array: Drawable[] = [];

    draw(context2D: CanvasRenderingContext2D) {

        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }

    addChild(displayObject: DisplayObject) {

        this.array.push(displayObject);
    }

}

class TextField extends DisplayObject {

    text: string = "";
    size: number = 50;
    font: string = "Arial";

    draw(context2D: CanvasRenderingContext2D) {

        context2D.font = this.size + "px" + " " + this.font;
        context2D.fillText(this.text, this.x, this.y);
    }
}

class Bitmap extends DisplayObject {

    image: HTMLImageElement;
    width: number;
    height: number;

    draw(context2D: CanvasRenderingContext2D) {
        
        context2D.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
