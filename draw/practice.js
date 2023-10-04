import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { students } from "../data.js";

async function drawPracticeTask(title, description, themes, tasks) {
  // Dimensions for the image
  const width = 1000;
  const height = 700;

  // Instantiate the canvas object
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "skyblue";
  context.fillRect(0, 0, width, height);

  const imagePosition = {
    w: 400,
    h: 300,
    x: 25,
    y: 200,
  };

  await loadImage("./img/practice-old.png").then((image) => {
    const { w, h, x, y } = imagePosition;
    context.drawImage(image, x, y, w, h);

    context.font = "30pt 'PT Sans'";
    context.textAlign = "center";
    context.fillStyle = "#000";
    context.fillText(title, 500, 80, 1000);

    context.font = "20pt 'PT Sans'";
    context.textAlign = "center";
    context.fillStyle = "#444";
    context.fillText(description, 500, 130, 1000);

    loadImage("./img/arrow-yellow.png").then((image) => {
      context.drawImage(image, 420, y + 100, 140, 120);

      loadImage("./img/practice-result.png").then((image) => {
        const { w, h, x, y } = imagePosition;
        context.drawImage(image, x + imagePosition.w + 150, y, w, h);

        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./img/practice-result-canvas.png", buffer);
        return true;
      });
    });
  });
}
export { drawPracticeTask };


