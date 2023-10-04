import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { students } from "../data.js";



function drawResult(name, money) {
  // Dimensions for the image
  const width = 1080;
  const height = 1080;

  // Instantiate the canvas object
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const imagePosition = {
    w: 1080,
    h: 1080,
    x: 0,
    y: 0,
  };

  loadImage("./img/template.png").then((image) => {
    const { w, h, x, y } = imagePosition;
    context.drawImage(image, x, y, w, h);


    context.font = "italic 20pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#000";
    context.fillText("14 Травня 2023 року", 600, 120);

    context.font = "bold 30pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#000";
    context.fillText(name, 230, 248);

    context.font = "30pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#333";
    context.fillText(`+ ${money} грн`, 770, 248);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./img/image20.png", buffer);
    return true;
  });


}
export { drawResult };
