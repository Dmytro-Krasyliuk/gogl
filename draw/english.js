import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import { students } from "../data.js";
registerFont("./fonts/el-messiri/el-messiri.ttf", { family: "El Messiri" }); 

async function drawEnglish(enWord, uaWord, studentName) {
  // Dimensions for the image
  const width = 1748;
  const height = 1240;

  // Instantiate the canvas object
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillRect(0, 0, width, height);
  const imagePosition = {
    w: 1748,
    h: 1240,
    x: 0,
    y: 0,
  };

  await loadImage("./img/english-new-word.png").then((image) => {
    const { w, h, x, y } = imagePosition;
    context.drawImage(image, x, y, w, h);

    context.font = "50pt 'El Messiri'";
    context.textAlign = "center";
    context.fillStyle = "#000";
    context.fillText(studentName, width / 2, 940, 1000);

     context.font = "50pt 'El Messiri'";
     context.textAlign = "left";
     context.fillStyle = "#fff";
     context.fillText(enWord, 260, 1185, 1000);


      context.font = "50pt 'El Messiri'";
      context.textAlign = "left";
      context.fillStyle = "#fff";
      context.fillText(uaWord, 1070, 1185, 1000);
      let date = `${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}`

      context.font = "30pt 'El Messiri'";
      context.textAlign = "left";
      context.fillStyle = "#444";
      context.fillText(date, 1550, 1080, 1000);


    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./img/english-new-word-result.png", buffer);
    return true;
  });
}

// drawEnglish('true', 'правда', 'Ярослав Дзюбенко');

export { drawEnglish };
