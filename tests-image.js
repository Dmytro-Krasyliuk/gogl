import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

async function testsImage(title) {
  const width = 600;
  const height = 300;
  let idLesson = uuidv4();

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const imagePosition = {
    w: 600,
    h: 300,
    x: 0,
    y: 0,
  };

  

  await loadImage(`./img/templates/tests/${(Math.random()*5).toFixed(0)}.png`).then((image) => {
    const { w, h, x, y } = imagePosition;
    context.drawImage(image, x, y, w, h);

    context.font = "26pt 'PT Sans'";
    context.textAlign = "left";
    context.fillStyle = "#fff";

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var words = text.split(" ");
      var line = "";

      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }

    wrapText(context, title, 40, 80, 520, 48);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./img/tests-create.png", buffer);
    console.log("1");
    return "./img/tests-create.png";
  });
}



export { testsImage };
