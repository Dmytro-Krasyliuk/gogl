import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { students } from "../data.js";
import { v4 as uuidv4 } from "uuid";

let technologiesImages = {
  js: "js.png",
  python: "python.png",
  pug: "pug.png",
  mongodb: "mongodb.png",
  react: "react.png",
  express: "express.png",
  nodejs: "nodejs.png",
  html: "html.png",
  css: "css.png",
  bootstrap: "bootstrap.png",
  scss: "scss.png",
  jquery: "jquery.png",
  figma: "figma.png",
};


async function drawSolo(name, grade, technologies, date, teacher, themes) {
  let themes_ = [...themes];
  for (let i = 0; i < themes_.length; i++) {
    if (themes_[i].startsWith('++')) {
      themes_.splice(i, 1);
    }
  }
  // Dimensions for the image
   
  const width = 1080;
  const height = 1080;
  let idLesson = uuidv4();

  // Instantiate the canvas object
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const imagePosition = {
    w: 1080,
    h: 1080,
    x: 0,
    y: 0,
  };

  let colorHand = "#53AFFF";

  await loadImage("./img/template-grade-individual-lesson.png").then(
    (image) => {
      const { w, h, x, y } = imagePosition;
      context.drawImage(image, x, y, w, h);

      context.font = "italic 20pt 'PT Sans'";
      context.textAlign = "left";
      context.fillStyle = "#fff";
      context.fillText(date, 600, 50);

      context.font = "bold 20pt 'PT Sans'";
      context.textAlign = "left";
      context.fillStyle = "#fff";
      context.fillText(name, 750, 50);

      context.font = "italic 14pt 'PT Sans'";
      context.textAlign = "left";
      context.fillStyle = colorHand;
      context.fillText(teacher, 835, 150);

      context.font = "italic 24pt 'PT Sans'";
      context.textAlign = "left";
      context.fillStyle = colorHand;
      context.fillText(grade, 850, 113);
      let themesLeft = 100;
      let themesTop = 600;

      // Тема до 20 символів. До 10 тем за урок
      for (let i = 0; i < themes_.length; i++) {
        if (i < 9) {
          if (i == 5) {
            themesLeft = 550;
            themesTop = 600;
          }

          context.font = "24pt 'PT Sans'";
          context.textAlign = "left";
          context.fillStyle = "#fff";
          context.fillText("- " + themes_[i], themesLeft, themesTop);
          themesTop += 80;
        }
        if (i == 10) {
          context.font = "italic 24pt 'PT Sans'";
          context.textAlign = "left";
          context.fillStyle = "#fff";
          context.fillText("та інші теми", themesLeft + 190, themesTop);
          themesTop += 80;
        }
      }

      loadImage("./img/signatures/signature.svg").then((image) => {
        context.drawImage(image, 900, 67, 150, 70);
        return true;
      });

      context.font = "16pt 'PT Sans'";
      context.textAlign = "left";
      context.fillStyle = "#fff";
      
      context.fillText(idLesson, 647, 1055);
    }
  );

  let top = 150;
  let left = 55;
  let leftGap = 100;
  let changeSize = true;
  for (let i = 0; i < technologies.length; i++) {
    await loadImage(
      "./img/technologies/" + technologiesImages[technologies[i]]
    ).then((image) => {
      let h = image.width / image.height;

      leftGap = 70 * h + 20;
      if (left + leftGap > 600 && changeSize == true) {
        top = 245;
        left = 55;
        changeSize = false;
      }
      context.drawImage(image, left, top, 70 * h, 70);
      left += leftGap;
    });
  }

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./img/template-grade-individual-lesson20.png", buffer);
  return idLesson;
}

export { drawSolo };
