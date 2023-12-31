import express from "express";
import cors from "cors";
import axios from "axios";
import cron from "node-cron";
import http from "http";
import { Server as socketIO } from "socket.io";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fetch from "node-fetch";
import { json } from "express";
import TelegramApi from "node-telegram-bot-api";
import * as htmlToImage from "html-to-image";
import nodeHtmlToImage from "node-html-to-image";
import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { JSDOM } from "jsdom";
import ffmpeg from "fluent-ffmpeg";
import escapeHTML from "escape-html";
import dotenv from "dotenv";
import request from "request";
import MP4Box from "mp4box";
import sharp from "sharp";

import {
  themes,
  students,
  templates,
  elementsData,
  apps,
  cars,
} from "./data.js";
import { result } from "./rss/quiz.js";
import time from "./other/time.js";
import { drawResult } from "./draw/quiz.js";
import { drawPracticeTask } from "./draw/practice.js";
import { drawSolo } from "./draw/solo-lesson.js";
import { testsImage } from "./tests-image.js";
import { generatePracticeTaskHTML } from "./practiceTasksHTML.js";
import getCodeColor from "./getCodeColor.js";
import generatePracticeTask from "./generatePracticeTask.js";
import { Practice, User, studentListPractice } from "./database/index.js";
import { Keyboards } from "./keyboards.js";
import { englishWords } from "./english.js";
import { drawEnglish } from "./draw/english.js";
import { randomUUID } from "crypto";

let modeGPT = false;

function showCarShop(indexCar, chatId, myCars) {
  let urlPhoto = "./img/cars/" + cars[indexCar].img;
  const svgData = fs.readFileSync(urlPhoto);
  sharp(svgData)
    .resize(600)
    .png()
    .toFile("output-svg.png")
    .then((data) => {
      // Отправить PNG изображение
      let status = "";
      if (myCars.includes(cars[indexCar].img)) {
        status = "buyed";
      }

      bot.sendPhoto(chatId, "./output-svg.png", {
        caption: `
<b>ВИ В МАГАЗИНІ АВТІВОК</b>
<code>CAR_ID: ${indexCar + 1}</code>

<b>Авто:</b> ${cars[indexCar].title} 
<b>Вартість:</b>  ${cars[indexCar].price} 💎`,
        parse_mode: "HTML",
        ...keyboards.carShop(cars[indexCar].price, indexCar, status),
      });
    });
}

class ShortId {
  constructor() {
    this.all = {};
  }
  set(data) {
    this.data = data;
    this.randomId = uuid().toString().slice(0, 7);
    this.all[this.randomId] = JSON.stringify(data);
    return this.randomId;
  }
  get(id) {
    this.id = id;

    return this.all[this.id];
  }
}

let shortId = new ShortId();

dotenv.config();

let asdfdf = [
  { day: "Понеділок", time: "21:30" },
  { day: "Середа", time: "22:15" },
];

let indexCar = 0;
let typeThemes = "practice";
let adminkaGroupId = -889347051;
let waitCardNumber = false;
const keyboards = new Keyboards();
let history = [];
let newGroupStudent = [];
let testsID = [];
let practiceList = [];
let idMsgThemes = 0;
let currentThemes = themes;
let formSoloImg = {
  idGroup: "",
  name: "",
  date: "",
  teacher: "Красилюк Дмитро",
  themes: [],
  technologies: [],
  grade: "",
  photos: [],
};
let newUserStatus;
let newUser = {
  name: "",
  family: "",
  age: 0,
  car: {
    currentCar: "car-3.svg",
    myCars: ["car-3.svg"],
  },
  group: "",
  price: "",
  date: {
    day: "",
    month: "",
    year: "",
  },
  contact: "",
  days: [],
  savedWorks: [],
};
let oldMessage = "";
let lastMsgId = 0;
let idCalendar = 0;
let idMsgTechnologies;
let activeGroupStudent = "";
const myId = 957139896;
const templateGroupId = -1001908490825;
const groupId = String(templateGroupId).slice(4);
let cc = "";

// const token = process.env.TOKEN;
const token = "6183220599:AAGzgg3MrVrxu2lu92WoBRRpLWanGa2UmWU";
let botId = "6183220599";
let rssDay = 0;
let userDay = {
  day: "",
  time: "",
};

const app = express();
const server = http.createServer(app);
const io = new socketIO(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 3008;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(json());
app.use(cors());
app.use(express.json());

// await User.updateMany(
//   {},
//   {
//     $set: {
//       savedWorks: [],
//     },
//   }
// );


function findPath(obj, target, currentPath = []) {
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const newPath = findPath(obj[key], target, currentPath.concat(key));
      if (newPath.length > 0) {
        return newPath;
      }
    } else if (JSON.stringify(obj[key]) === JSON.stringify(target)) {
      currentPath.push(key);
      return currentPath;
    }
  }
  return [];
}
function accessNestedObject(obj, path) {
  let currentLevel = obj;
  for (let key of path) {
    currentLevel = currentLevel[key];
    if (currentLevel === undefined) {
      return undefined; // Возвращаем undefined, если путь недопустим
    }
  }
  return currentLevel;
}




async function addUserMoney(chatId, money) {
  let currentUser = await User.findOne({ idGroup: chatId });
  currentUser.diamonds += money;
  await currentUser.save();
  return currentUser.diamonds;
}

async function removeUserMoney(chatId, money) {
  let currentUser = await User.findOne({ idGroup: chatId });
  currentUser.diamonds -= money;
  await currentUser.save();
  return currentUser.diamonds;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateQuestion() {
  const correctWord = getRandomElement(englishWords);
  let options = englishWords.filter((word) => word !== correctWord);
  options = options.sort(() => 0.5 - Math.random()).slice(0, 3);

  options.push(correctWord);
  options = options.sort(() => 0.5 - Math.random());

  return {
    correctWord,
    options,
  };
}

function getNamesOneStudentByIdGroup(id) {
  let names = "";
  students.forEach((student) => {
    if (student.idGroup == id) {
      names = student.name + " " + student.lastName;
    }
  });
  return names;
}

function viewCal(year, month, chat_id, cbq_id = null, message_id = null) {
  // получаем массив дней месяца
  let dayLines = getDays(year, month);
  // определим переданную дату
  let currentMonthDate = new Date(+year, +month);
  // дата предыдущего месяца
  let prevMonthDate = new Date(
    new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() - 1)
  );
  // дата следующего месяца
  let nextMonthDate = new Date(
    new Date(currentMonthDate).setMonth(currentMonthDate.getMonth() + 1)
  );
  // определим параметры переданного месяца
  let current_info =
    setBeforeZero(currentMonthDate.getMonth() + 1) +
    "." +
    currentMonthDate.getFullYear();
  // определим кнопки
  let buttons = [];
  // первый ряд кнопок это навигация календаря
  buttons.push([
    {
      text: "<<<",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: current_info,
      callback_data: "info_" + current_info,
    },
    {
      text: ">>>",
      callback_data:
        "cal_" + nextMonthDate.getFullYear() + "_" + nextMonthDate.getMonth(),
    },
  ]);

  buttons.push([
    {
      text: "ПН",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: "ВТ",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: "СР",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: "ЧТ",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: "ПТ",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: "СБ",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
    {
      text: "НД",
      callback_data:
        "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth(),
    },
  ]);

  // переберем дни
  dayLines.forEach(function (line) {
    // добавим ряд кнопок
    buttons[buttons.length] = [];
    // переберем линию дней
    line.forEach(function (day) {
      // добавим кнопку
      buttons[buttons.length - 1].push({
        text:
          month == new Date().getMonth() && day == new Date().getDate()
            ? "🟢"
            : day,
        callback_data:
          day > 0
            ? "info_" + setBeforeZero(day) + "." + current_info
            : "inline",
      });
    });
  });

  // готовим данные
  let data = {
    chat_id: chat_id,
    text:
      `<b>Календар:</b> ` +
      currentMonthDate.toLocaleString("uk-UA", {
        month: "long",
        year: "numeric",
      }) +
      `\n
Умовні позначення:
🟢 - Сьогодні  \n
      
      `,
    parse_mode: "html",
    reply_markup: { inline_keyboard: buttons },
  };
  // проверим как отправлять: как новое или замена содержимого
  if (message_id !== null) {
    // гасим запрос
    notice(cbq_id);
    // добавим message_id
    data.message_id = message_id;
    // направим в Телеграм на изменение сообщения
    query("editMessageText", data);
  } else {
    // направим сообщение в чат
    query("sendMessage", data);
  }
}

async function query(method, fields) {
  let ca = request({
    url: "https://api.telegram.org/bot" + token + "/" + method,
    method: "post",
    headers: { "content-type": "application/json" },
    json: fields,
  });
}

function getDays(year, month) {
  // получаем дату
  let d = new Date(year, month);
  // объявляем массив
  let days = [];
  // добавляем первую строку
  days[days.length] = [];
  // добавляем в первую строку пустые значения
  for (let i = 0; i < getNumDayOfWeek(d); i++) {
    days[days.length - 1].push("-");
  }
  // выходим пока месяц не перешел на другой
  while (d.getMonth() === +month) {
    // добавляем в строку дни
    days[days.length - 1].push(d.getDate());
    // вс, последний день - перевод строки
    if (getNumDayOfWeek(d) % 7 === 6) {
      // добавляем новую строку
      days[days.length] = [];
    }
    // переходим на следующий день
    d.setDate(d.getDate() + 1);
  }
  // дозаполняем последнюю строку пустыми значениями
  if (getNumDayOfWeek(d) !== 0) {
    for (let i = getNumDayOfWeek(d); i < 7; i++) {
      days[days.length - 1].push("-");
    }
  }
  // вернем массив
  return days;
}

function getNumDayOfWeek(date) {
  // получим день недели
  let day = date.getDay();
  // вернем на 1 меньше [0 - вск]
  return day === 0 ? 6 : day - 1;
}

function notice(cbq_id, text = null) {
  // определим данные
  let data = {
    callback_query_id: cbq_id,
    alert: false,
  };
  // если есть текст то добавим
  if (text !== null) {
    data.text = text;
  }
  // отправим в Телеграм
  query("answerCallbackQuery", data);
}

function setBeforeZero(num) {
  return ("0" + num).slice(-2);
}

function getNamesStudentByIdGroup(id) {
  let newGroupNames = [];
  newGroupStudent.forEach((id) => {
    students.forEach((student) => {
      if (student.idGroup == id) {
        newGroupNames.push(student.name + " " + student.lastName);
      }
    });
  });
  return newGroupNames;
}

async function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const base64String = imageBuffer.toString("base64");

    return base64String;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
}
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function addNewUser(newUser) {
  return {
    name: newUser.name,
    lastName: newUser.family,
    days: newUser.days,
    age: newUser.age,
    car: newUser.car,
    savedWorks: newUser.savedWorks,
    pay: {
      day: newUser.day,
      month: newUser.month,
      year: newUser.year,
      sum: newUser.price,
      isPay: false,
    },
    events: [],
    quiz: {
      allMoney: 0,
      currentMoney: 0,
      lastResultMoney: 0,
    },
    diamonds: 0,
    contact: [],
    english: [],

    idGroup: newUser.group,
  };
}

async function sendFirstInfo(chatId, name, schedule) {
  let messageToPin = await bot.sendPhoto(chatId, "./img/other/start-it.jpg", {
    caption: `
<i>Привіт, ${name}!</i>

<b>🥳 Ми починаємо наші заняття по програмуванню!</b>

Ось уся необхідна інформація, яка стосується нашого навчання:

<b>🔐 Постійні доступи до занять:</b>

🔎 https://us04web.zoom.us/j/3533531158?pwd=nTl2kiicwvOgLNOHbaDaGMi8JQ1Ttj.1

🔑 <b>ID:</b> 353 353 1158
🔑 <b>Код доступу:</b> start
  `,
    parse_mode: "HTML",
  });
  await bot.pinChatMessage(chatId, messageToPin.message_id);

  let scheduleText = ``;

  schedule.forEach((item) => {
    scheduleText += `
📌 ${item.day}: ${item.time}
`;
  });
  await bot.sendMessage(
    chatId,
    `
<b>Розклад індивідуальних занять:</b>
<b>${scheduleText}</b>
⚠️ Час вказаний за Києвом.
⚠️ Для першого заняття нічого встановлювати не потрібно. Достатньо лише програми Zoom для того щоб приєднатись на заняття.


  `,
    {
      parse_mode: "HTML",
    }
  );

  await bot.sendMessage(
    chatId,
    `
<b>📆 Розклад інших заходів:</b>

<b>📌 Понеділок: </b>
Отримуєте авторський відео-матеріал.

<b>📌 Вівторок:</b>
Отримуєте теоретичні та практичні завдання для засвоєння відео-матеріалу.

<b>📌 Четвер: </b>
<u>20:00</u> - Змагання по програмуванню.

<b>📌 Субота: </b>
<u>20:00</u> - Заняття у групі. <i>Легкий рівень.</i>

<b>📌 Неділя: </b>
<u>20:00</u> - Заняття у групі. <i>Важкий рівень.</i>

  `,
    {
      parse_mode: "HTML",
    }
  );
}

app.get("/tests", async (req, res) => {
  const token = "6183220599:AAGzgg3MrVrxu2lu92WoBRRpLWanGa2UmWU";
  const myId = 957139896;

  let result = {
    idTask: 1,
    idStudent: 957139896,
    link: "https://cdpn.io/cpe/boomboom/index.html?key=index.html-926c7914-f3e8-a91b-5f31-f26f474c5703",
    successTask: [1, 0, 0, 0],
    code: {
      html: "%0A%20%20%20%20%0A%3Cdiv%20class%3D%22block%22%3E%20%3Cdiv%3E%0A%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%0A%20%20%0A%3Cscript%20src%3D%22https%3A%2F%2Fcpwebassets.codepen.io%2Fassets%2Fcommon%2FstopExecutionOnTimeout-2c7831bb44f98c1391d6a4ffda0e1fd302503391ca806e7fcc7b9b87197aec26.js%22%3E%3C%2Fscript%3E%0A%20%20%3Cscript%20src%3D%22https%3A%2F%2Fcdpn.io%2Fcpe%2Fboomboom%2Fpen.js%3Fkey%3Dpen.js-926c7914-f3e8-a91b-5f31-f26f474c5703%22%20crossorigin%3D%22%22%3E%3C%2Fscript%3E%0A%0A%0A%3C%2Fdiv%3E",
      css:
        "\n" +
        "    .block {\n" +
        "  width: 100px;\n" +
        "  height: 300px;\n" +
        "  background: red;\n" +
        "}\n" +
        "        \n" +
        "  ",
      js: "",
    },
  };

  let task = await Practice.findOne({ id: result.idTask });
  let successTask = "";
  let wrongTask = "";

  result.successTask.forEach((status, i) => {
    if (status == 1) {
      successTask += `✅ ${task.tasks[i].title}
`;
    } else {
      wrongTask += `❌ ${task.tasks[i].title}
`;
    }
  });

  let templateText =
    `
*Учень завершив практичне завдання!*

Учень: ${getNamesOneStudentByIdGroup(result.idStudent)}

Завдання №${result.idTask}: 
*${task.name}*

Виконав завдання:
${successTask}
Не виконав завдання:
${wrongTask}

[Переглянути роботу:](${result.link})

Код:
*HTML*:
` +
    "`" +
    decodeURIComponent(result.code.html) +
    "`" +
    `

*CSS*:

` +
    "`" +
    decodeURIComponent(result.code.css) +
    "`" +
    `

*JS*
` +
    "`" +
    decodeURIComponent(result.code.js) +
    "`" +
    `
  
  `;

  templateText = templateText.replace(/\n/g, "%0A");

  let sendURL = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${myId}&text=${templateText}&parse_mode=Markdown`;
  fetch(sendURL);

  res.send("ok");
});
app.get("/sandbox/select/:data", function (req, res) {
  let data = req.params.data;
});

app.get("/getTasks/:idStudent/:idTask", async (req, res) => {
  let idStudent = req.params.idStudent;
  let idTask = req.params.idTask;
  let task = "not defined";
  task = await Practice.findOne({ id: idTask });
  return res.send({ data: task });
});

app.get("/sandbox-elements/:idTask", async (req, res) => {
  let idTask = req.params.idTask;
  let task = "not defined";
  task = await Practice.findOne({ id: idTask });
  return res.send({ data: task });
});

app.get("/", async (req, res) => {
  res.render("practice", {});
});
app.get("/get/practice/:idTask/", async (req, res) => {
  let idTask = req.params.idTask;
  let task = await Practice.findOne({ id: idTask });

  let studentPractice = await studentListPractice.findOne({
    idPractice: idTask,
  });

  console.log("studentPractice ", studentPractice);

  if (studentPractice) {
    let allStudentsData = [];

    if (studentPractice) {
      studentPractice.students.forEach((student) => {
        let myProfile = "";
        allStudentsData.push({
          studentName: "Incognito",
          studentCar: `${student.car}`,
          studentId: student.idStudent,
          myProfile: myProfile,
          studentCurrentPosition: 3,
        });
        console.log(allStudentsData.studentCar);
      });
    }

    let HTML = task.codeResult.html;
    let CSS = task.codeResult.css;
    let JS = task.codeResult.js;
    let taskName = task.name;

    let data = {
      nameStudent: nameStudent,
      idStudent: idStudent,
      idTask: idTask,
      taskName: taskName,
      allStudentsData: allStudentsData,
      task: task,
      tasks: task.tasks,
      code: {
        HTML: HTML,
        CSS: CSS,
        JS: JS,
      },
    };

    res.render("practice", data);
  }
  res.render("practice", {});
});


app.get("/get/practice/:idTask/:idStudent", async (req, res) => {
  let idTask = req.params.idTask;
  let idStudent = req.params.idStudent;
  let nameStudent = getNamesOneStudentByIdGroup(idStudent);
  let task = await Practice.findOne({ id: idTask });

  let studentPractice = await studentListPractice.findOne({
    idPractice: idTask,
  });

  console.log("studentPractice ", studentPractice);

  if (studentPractice) {
    let allStudentsData = [];

    if (studentPractice) {
      studentPractice.students.forEach((student) => {
        let myProfile = "";
        if (student.idStudent == idStudent) {
          myProfile = "your-car";
        }
        allStudentsData.push({
          studentName: getNamesOneStudentByIdGroup(student.idStudent),
          studentCar: `${student.car}`,
          studentId: student.idStudent,
          myProfile: myProfile,
          studentCurrentPosition: 3,
        });
        console.log(allStudentsData.studentCar);
      });
    }

    let HTML = task.codeResult.html;
    let CSS = task.codeResult.css;
    let JS = task.codeResult.js;
    let taskName = task.name;

    let data = {
      nameStudent: nameStudent,
      idStudent: idStudent,
      idTask: idTask,
      taskName: taskName,
      allStudentsData: allStudentsData,
      task: task,
      tasks: task.tasks,
      code: {
        HTML: HTML,
        CSS: CSS,
        JS: JS,
      },
    };

    res.render("practice", data);
  }
  res.render("practice", {});
});

app.get("/css/style.css", function (req, res) {
  res.sendFile(__dirname + "/public/css/style.css");
});

app.get("/js/practice/:idTask/:idStudent", async (req, res) => {
  let idTask = req.params.idTask;
  let idStudent = req.params.idStudent;
  let studentPractice = await studentListPractice.findOne({
    idPractice: idTask,
  });
  let imageResult = studentPractice.photo;
  let template = `
  
let idStudent = ${idStudent};
let idTask = ${idTask};
let imageResult = '${imageResult}'

initProject(idStudent, idTask, imageResult);
  `;
  res.setHeader("Content-Type", "application/javascript");
  res.send(template);
});

app.post("/set/practice", async (req, res) => {
  const data = req.body;
  const token = "6183220599:AAGzgg3MrVrxu2lu92WoBRRpLWanGa2UmWU";
  const myId = 957139896;
  let isFinish = false;

  let result = req.body;

  let task = await Practice.findOne({ id: result.idTask });
  let studentPractice = await studentListPractice.findOne({
    idPractice: result.idTask,
  });

  studentPractice.students.forEach(async (student, index) => {
    if (student.idStudent == result.idStudent) {
      isFinish = student.finish;
      if (isFinish == false) {
        const nestedArrayPath = `students.${index}.historyCode`;
        const studentPath = `students.${index}.finish`;

        const newElement = {
          html: result.code.html,
          css: result.code.css,
          js: result.code.js,
        };
        let a = await studentListPractice.updateOne(
          { idPractice: result.idTask },
          { $push: { [nestedArrayPath]: newElement } }
        );

        if (result.type == "sendInfo") {
          let aa = await studentListPractice.updateOne(
            { idPractice: result.idTask },
            { [studentPath]: true }
          );
        }
      }
    }
  });

  if (isFinish == false) {
    let successTask = "";
    let wrongTask = "";

    result.successTask.forEach((status, i) => {
      if (status == 1) {
        successTask += `✅ ${task.tasks[i].title} ${task.tasks[i].label}
`;
      } else {
        wrongTask += `❌ ${task.tasks[i].title} ${task.tasks[i].label}
`;
      }
    });

    let templateText;

    if (result.type == "updateInfo") {
      templateText =
        `
*ОНОВЛЕННЯ ДАННИХ*

Учень: ${getNamesOneStudentByIdGroup(result.idStudent)}

Завдання №${result.idTask}: 
*${task.name}*

Виконав завдання:
${successTask}
Не виконав завдання:
${wrongTask}

[Переглянути роботу:](${result.link})

Код:
*HTML*:
` +
        "`" +
        decodeURIComponent(result.code.html) +
        "`" +
        `

*CSS*:

` +
        "`" +
        decodeURIComponent(result.code.css) +
        "`" +
        `

*JS*
` +
        "`" +
        decodeURIComponent(result.code.js) +
        "`" +
        `
  
  `;

      templateText = templateText.replace(/\n/g, "%0A");
    }

    if (result.type == "sendInfo") {
      templateText =
        `
*Учень завершив практичне завдання!*

Учень: ${getNamesOneStudentByIdGroup(result.idStudent)}

Завдання №${result.idTask}: 
*${task.name}*

Виконав завдання:
${successTask} 
Не виконав завдання:
${wrongTask}

[Переглянути роботу:](${result.link})

Код:
*HTML*:
` +
        "`" +
        decodeURIComponent(result.code.html) +
        "`" +
        `

*CSS*:

` +
        "`" +
        decodeURIComponent(result.code.css) +
        "`" +
        `

*JS*
` +
        "`" +
        decodeURIComponent(result.code.js) +
        "`" +
        `
  
  `;

      templateText = templateText.replace(/\n/g, "%0A");
    }

    let sendURL = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${myId}&text=${templateText}&parse_mode=Markdown`;
    fetch(sendURL);

    res.send("ok");
  } else {
    res.send("error");
  }
  // res.send(`Hello, POST request received! Data: ${JSON.stringify(data)}`);
});

// io.on("connection", (socket) => {
//   console.log("New client connected");

//   // socket.on("codeChange", (data) => {
//   //   console.log("Code change event received from client");
//   //   socket.broadcast.emit("codeChange", data);
//   // });

//   // socket.on("clear-hightlight", (data) => {
//   //   console.log("clear-hightlight");
//   //   socket.broadcast.emit("clear-hightlight", data);
//   // });

//   // socket.on("change-mouse", (data) => {
//   //   socket.broadcast.emit("change-mouse", data);
//   // });

//   // socket.on("click", (data) => {
//   //   console.log("click");
//   //   socket.broadcast.emit("click", data);
//   // });

//   // socket.on("highlightText", (data) => {
//   //   console.log("Highlight text event received from client");
//   //   socket.broadcast.emit("highlightText", data);
//   // });

//   // socket.on("block-code", () => {
//   //   console.log("block-code");
//   //   socket.broadcast.emit("block-code");
//   // });

//   // socket.on("unblock-code", () => {
//   //   console.log("unblock-code");
//   //   socket.broadcast.emit("unblock-code");
//   // });

//   socket.on("car-position", (data) => {
//     console.log("car-position");
//     socket.broadcast.emit("car-position", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "start" },
  { command: "/admin", description: "admin" },
  { command: "/themes", description: "Усі теми" },
  { command: "/results", description: "Результати тестів" },
]);

await Practice.deleteMany({});
await studentListPractice.deleteMany({});

let idPracticeTask = [125, 126];



async function createLearnTheme (currentTheme, chatId) {
   let idTheme = shortId.set(currentTheme);

        let kb = await keyboards.theme(currentTheme, idTheme);

        await bot.sendPhoto(chatId, currentTheme.default.images[0].url, {
          caption: `
*Вивчаємо тему: ${currentTheme.title.trim()}*
*Скорочено: ${currentTheme.speedCode.trim()}*
${currentTheme.description}
  `,
          parse_mode: "Markdown",
        });

        let allCode = "";
        for (let item of currentTheme.default.code) {
          allCode += `
🧑‍💻 ${item.title}
\`${item.body}\``;
        }

        let allSandbox = "";
        for (let item of currentTheme.default.sandbox) {
          allSandbox += `
🔸 [${item.title}](${item.url.trim()})`;
        }
        let allFigma = "";
        for (let item of currentTheme.default.figma) {
          allFigma += `
🔸 [${item.title}](${item.url.trim()})`;
        }
        let allLinks = "";
        for (let item of currentTheme.links) {
          allLinks += `
🔹 [${item.title}](${item.url.trim()})`;
        }

        await bot.sendMessage(
          chatId,
          `
*Приклади коду:*
${allCode}
 
*Приклади в пісочниці:*
${allSandbox}

*Приклади в Figma:*
${allFigma}

*Посилання по темі:*
${allLinks}
 
  `,
          { parse_mode: "Markdown", disable_web_page_preview: true, ...kb }
        );
}

// User.updateMany({}, { $set: { english: [] } })
//   .then(result => {
//     console.log('Field "english" added to all users:', result);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });

await Practice.insertMany([
  generatePracticeTask({
    id: "html_a_1",
    name: "Посилання на карти",
    description: "Києва, Одеси та Чернівців",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<p>Переглянь карту 
<a href="https://goo.gl/maps/1x8yTmk9G46BdaFd8">Києва</a>
<a href="https://goo.gl/maps/EcbEr2itoNRYhbTt9">Одеси</a>
<a href="https://goo.gl/maps/iKdjqLVqR9fuisPC9">Чернівців</a>
  
</p>`,
      css: ``,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
  generatePracticeTask({
    id: "set_s1_1",
    name: "Базові елементи",
    description: "прямокутники, тексти, зображення",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<div>
      <img src="" alt="">
      <h1>Hello</h1>
      <h6>Hello</h6>
      </div>
      `,
      css: ``,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
  generatePracticeTask({
    id: "set_s5_1",
    name: "Базові елементи",
    description: "прямокутники, тексти, зображення",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<div>
      <h1>Hello</h1>
      <h6>Hello</h6>
      <img class="image" src="https://hips.hearstapps.com/hmg-prod/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg" alt="">
      <button class="delete">delete item</button>
      <h5 class="text5">Hello</h5>
      <a href="https://facebook.com" class="facebook">link to Facebook</a>
      <h4>Hello</h4>
      <a href="https://youtube.com" class="youtube">link to YouTube</a>
      <h2>Hello</h2>
      <h1 class="bigText">Hello</h1>
      <h1 class="bigText">Hello</h1>
      <a href="https://instagram.com" class="instagram">link to instagram</a>
      <div class="rect">i am rectangle</div>
      <img class="image" src="https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408.jpg" alt="">
      <h5 class="text5">Hello</h5>
      <img class="image" src="https://img.freepik.com/free-vector/vector-isolated-realistic-soccer-ball-white_1284-41932.jpg?w=2000" alt="">
      <a href="https://youtube.com" class="youtube">link to YouTube</a>
      <button class="delete">delete item</button>
      <div class="rect2">i am rectangle 2</div>
      <h2>Hello</h2>
      <a href="https://apple.com" class="apple">link to Apple</a>
      <h1 class="bigText">Hello</h1>
      <button class="delete">delete item</button>
      </div>
      `,
      css: `
      .image {
        width: 100px;
      }
      .delete{
        background: red;
        width: 200px;
      }
      .bigText {
        background: yellow;
      }
      .facebook {
        width: 200px;
        background: blue;
      }
      `,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
  generatePracticeTask({
    id: "set_base_mega",
    name: "Базові елементи",
    description: "прямокутники, тексти, зображення",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<div>
      <img src="" alt="">
      <h1>Hello</h1>
      <div></div>
      <h6>Hello 2</h6>
      <h2>Disney</h2>
      <div></div>
      <img src="" alt="">
      <h6>Hello 2</h6>
      <div></div>
      <h6>Hello 2</h6>
      <img src="" alt="">
      <div></div>
      <img src="" alt="">
      <div></div>
      <h1>History</h1>
      <h6>Hello 2</h6>
      <img src="" alt="">
      <div></div>
      <i></i>
      <b></b>
      <u></u>
      <u>end</u>
      </div>
      `,
      css: ``,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
  generatePracticeTask({
    id: "set_css2_1",
    name: "Тренуємо CSS #1",
    description: "колір найбільшого тексту",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<h1>Hello</h1>
      `,
      css: `h1 {
        color: red;
      }`,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
  generatePracticeTask({
    id: "set_css3_1",
    name: "Тренуємо CSS #2",
    description: "Налаштування прямокутника",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<div></div>
      `,
      css: `div {
        width: 200px;
        height: 100px;
        background: red;
      }`,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
  generatePracticeTask({
    id: "css_display_flex_1",
    name: "4 Елемента в ряд",
    description: "display: flex & gap",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<div class="app">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>`,
      css: `.app {
  width: 260px;
  display: flex;
  gap: 10px;
  background: #0CE508;
  padding: 20px;
}
.item {
  background: orange;
  color: white;
  padding: 20px;
  border-radius: 4px;
  font-size: 30px;
}`,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),

  generatePracticeTask({
    id: "html_a_2",
    name: "Посилання на facebook",
    description: "з різними атрибутами",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<div class="app">
  <a href="https://www.facebook.com/" target="_blank" class="facebook" title="Популярна соц. мережа" id="fb">link to Facebook</a>
</div>`,
      css: ``,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),

  generatePracticeTask({
    id: "html_abbr_1",
    name: "Посилання на карти",
    description: "Києва, Одеси та Чернівців",
    type: "classElement",
    level: 1,
    codeResult: {
      html: `<p>Переглянь карту 
<a href="https://goo.gl/maps/1x8yTmk9G46BdaFd8">Києва</a>
<a href="https://goo.gl/maps/EcbEr2itoNRYhbTt9">Одеси</a>
<a href="https://goo.gl/maps/iKdjqLVqR9fuisPC9">Чернівців</a>
  
</p>`,
      css: ``,
      js: `
    `,
    },
    data: {
      html: ``,
      css: ``,
      js: ``,
    },
  }),
]);

// // Обработка команды /start
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(
//     chatId,
//     "Привет! Нажми на эту ссылку для теста: [Alert](https://t.me/DimaNice_Bot?start=alert)",
//     {
//       parse_mode: "Markdown",
//     }
//   );
// });

// Обработка команды /alert
bot.onText(/\/alert/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Это всплывающее уведомление! ⚠️");
});

// Обработка deep linking
bot.onText(/\/start alert/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "⚠️ Это всплывающее уведомление через deep linking! ⚠️"
  );
});

bot.onText(/\/start (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const param = match[1];

  if (param === "MONEY_NEWTHEME") {
    bot.sendMessage(
      chatId,
      `
<b>📝 Умови гри:</b>
Вам необхідно вивчити самостійно нову тему (переглянути відео та прочитати текст) 
після цього відповісти на тестові питання.

За кожну правильну відповідь ви будете отримувати +50 💎

Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("NEWTHEME") }
    );
  }

  else if (param === "MONEY_OLDTHEME") {
    bot.sendMessage(
      chatId,
      `
<b>📝 Умови гри:</b>
За кожну правильну відповідь ви будете отримувати +20 💎
За неправильну -5 💎

Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("OLDTHEME") }
    );
  }

  else if (param === "MONEY_INDIV") {
    bot.sendMessage(
      chatId,
      `
<b>📝 Умови гри:</b>
За кожну правильну відповідь ви будете отримувати +20 💎
За неправильну -5 💎

Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("INDIV") }
    );
  }
  else if (param === "MONEY_WORK") {
    bot.sendMessage(
      chatId,
      `
<b>📝 Умови гри:</b>
За кожну правильну відповідь ви будете отримувати +20 💎
За неправильну -5 💎

Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("WORK") }
    );
  }

  else if (param === "MONEY_GROUP") {
    bot.sendMessage(
      chatId,
      `
<b>📝 Умови гри:</b>
За кожну правильну відповідь ви будете отримувати +20 💎
За неправильну -5 💎

Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("GROUP") }
    );
  }

  else if (param === "MONEY_TEST") {
    bot.sendMessage(
      chatId,
      `
<b>📝 Умови гри:</b>
За кожну правильну відповідь ви будете отримувати +20 💎
За неправильну -5 💎

Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("TEST") }
    );
  }
  else if (param === "MONEY_PRACTICE") {
    bot.sendMessage(
      chatId,
      `
  <b>📝 Умови гри:</b>
  За кожну правильну відповідь ви будете отримувати +20 💎
  За неправильну -5 💎

  Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("PRACTICE") }
    );
  }
  else if (param === "MONEY_VIDEO") {
    bot.sendMessage(
      chatId,
      `
  <b>📝 Умови гри:</b>
  За кожну правильну відповідь ви будете отримувати +20 💎
  За неправильну -5 💎

  Якщо усі умови зрозумілі натискайте на кнопку <b>ПОЧАТИ ГРУ</b>`,
      { parse_mode: "HTML", ...keyboards.keyboardStartGame("VIDEO") }
    );
  }
});

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  lastMsgId = msg.message_id;
//   bot.sendMessage(
//     chatId,
//     `
//     <a href="tg://user?id=123456789">inline mention of a user</a>
// <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>

//     Your code python:
//     <pre><code class="language-python">
// if 5 > 3:
//   print(120)
// def an(val1, val2):
//     input('your code')
//     </code></pre>`,
//     { parse_mode: "HTML" }
//   );

  if (modeGPT) {
    let dataPerson = {
      age: 13,

    }
    let startData = `Привіт!
    Мені ${dataPerson.age} років та я вивчаю веб програмування.
    В мене є питання. По можливості дай приклад коду щоб мені було усе зрозуміло.
    Спробуй зрозуміти мене з напівслова.
    Не починай відповідь з питання. Просто дай відповідь. Дай відповідь і все!
    Ось моє питання: 

    `; 
    bot.sendMessage(
      chatId,
      "<i>⏳ Зачекайте Chat GPT скоро дасть відповідь на ваше питання</i>",
      { parse_mode: "HTML" }
    );
    modeGPT = false;


    const API_KEY = "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";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

// Ви можете створити фон сайту за допомогою HTML та CSS. 
// Для цього потрібно додати наступний код до вашого HTML-документу:

// <body style="background-image: url('path-to-image.jpg');">

// Де path-to-image.jpg це посилання на зображення, яке ви бажаєте використовувати як фон. 
// Ви також можете додати інші стилі для зображення фону. 
// Наприклад, ви можете змінити розташування фонового зображення за допомогою атрибута background-position:

// <body style="background-image: url('path-to-image.jpg'); background-position: center;">


    const prompt = startData + text;
    const maxTokens = 150;

    const data = {
      prompt: prompt,
      max_tokens: maxTokens,
    };

    let client = axios.create({
      headers: {
        Authorization: 'Bearer ' + API_KEY
      }
    })

    let params = {
      prompt: prompt,
      model: "text-davinci-003",
      max_tokens: 1000,
      temperature: 0.8,
    };

    client
      .post("https://api.openai.com/v1/completions", params)
      .then((result) => {
        let res = result.data.choices[0].text;
        bot.sendMessage(chatId, res);
      })
      .catch((err) => {
        bot.sendMessage(chatId, 'Сталась помилка. Спробуйте ще раз.', { parse_mode: "HTML" });
      
        console.log("error", err);
      });

    return true;
  }
  let checkUser = await User.find({ idGroup: chatId });
  if (checkUser.length == 0) {
    return bot.sendMessage(chatId, "Ви не зареєстровані на навчання ❌");
  }
  if (waitCardNumber) {
    let currentUser = await User.findOne({ idGroup: chatId });

    let curMoney = currentUser.quiz.currentMoney;

    bot.sendMessage(
      adminkaGroupId,
      `
<b>Запит на виведення коштів:</b>

<b>Учень:</b> ${getNamesOneStudentByIdGroup(chatId)}
<b>Всього грошей:</b> ${curMoney} грн
<b>Номер картки:</b> ${text}

`,
      { parse_mode: "HTML" }
    );
    bot.sendMessage(
      chatId,
      `
<b>💸 Ваша заявка успішно відправлена!</b>

⏳ Як тільки Дмитро звільниться, відправе вам кошти
          `,
      { parse_mode: "HTML" }
    );
    waitCardNumber = false;
  } else {
    if (newUserStatus) {
      if (newUserStatus == "name") {
        newUser.name = text;
        bot.sendMessage(chatId, "Вкажіть прізвище учня");
        newUserStatus = "family";
      } else if (newUserStatus == "family") {
        newUser.family = text;
        bot.sendMessage(chatId, "Вкажіть вік учня");
        newUserStatus = "age";
      } else if (newUserStatus == "age") {
        newUser.age = Number(text);
        bot.sendMessage(
          chatId,
          "Оберіть день занятя",
          keyboards.keyboardDaysWeek
        );
        newUserStatus = "schedule";
      } else if (newUserStatus == "price") {
        // if () { 112

        // }
        newUser.group = text;
        bot.sendMessage(chatId, "Вкажіть вартість навчання за місяць");
        newUserStatus = "idGroup";
      } else if (newUserStatus == "idGroup") {
        newUser.price = text;
        bot.sendMessage(chatId, "Вкажіть ID групи");
        newUserStatus = "date";
      } else if (newUserStatus == "date") {
        try {
          let c = await bot.getChatMember(text, botId);

          newUser.group = text;
          bot.sendMessage(chatId, "Вкажіть дату початку занять та оплати");
          newUserStatus = "contact";
        } catch (e) {
          bot.sendMessage(
            chatId,
            "Вкажіть вірний ID групи. Можливо Бот не є адміністратором цієї групи"
          );
          newUserStatus = "date";
        }
      } else if (newUserStatus == "contact") {
        newUser.contact = text;
        bot.sendMessage(chatId, "Вкажіть контактну особу");
        newUserStatus = "success";
      } else if (newUserStatus == "success") {
        // console.log(newUser);
        try {
          await bot.setChatPhoto(newUser.group, "./img/other/ava-group.png");
        } catch (e) {}
        let link = await bot.getChat(Number(newUser.group));
        // console.log(link);
        // console.log(link.invite_link);
        // bot.sendMessage(chatId, link.invite_link);

        bot.sendPhoto(chatId, "./img/other/invite-group.png", {
          caption: `<b>🥳Вітаю! Ваше навчання вже розпочинається!</b>

<b>1 крок:</b>
Приєднайтесь до групи: 
${link.invite_link}

<b>Це ваша особиста, основна група, де буде інформація лише про Ваше навчання, Ваші домашки, Ваші оцінки і т.д.</b> 

<i>Також це запрошення, за бажанням, ви можете відправити усім хто має бути в курсі всіх подій стосовно навчання (батько, мати, син, донька і т.д.)</i>`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Приєднатись до групи", url: link.invite_link }],
            ],
          },
        });

        User.insertMany(addNewUser(newUser))
          .then(function () {
            // console.log("Успешно сохраненные элементы в БД");
          })

          .catch(function (err) {});

        bot.sendMessage(chatId, "Учень успішно зареєстрований!");
        newUserStatus = undefined;
        // console.log(newUser.group);

        sendFirstInfo(newUser.group, newUser.name, newUser.days);
      }
    }

    // commands
    if (text === "/themes") {
      let titles = "";
      for (let i = 0; i < themes.length; i++) {
        titles += themes[i].title + "\n";
      }
      bot.sendMessage(chatId, titles);
    }

    // commands
    if (text === "/start") {
      bot.sendMessage(
        chatId,
        `
<b>🥳 Вітаю!</b>
Ти в головному меню.

<b>Я допоможу тобі:</b>
▪️ Вивчити програмування, 
▪️ Заробити алмази,
▪️ Закріпити теми. 
Згенерую теоретичні та практичні завдання.
▪️ Дізнатись розклад та інформацію про оплату

Також в мене є вбудований 💬 Chat GPT (штучний інтелект). 

<b>Обери що саме тебе цікавить👇 </b>     
      `,
        {
          parse_mode: "HTML",
          ...keyboards.keyboardStudents,
        }
      );
      // bot.answer_callback_query(
      //   callback_query_id = cmd.id,
      //   text = "Неверно, Верный ответ...",
      //   show_alert = True
      // );
      //  bot.answerCallbackQuery(msg.id, {
      //    text: "Вы нажали на кнопку 1",
      //  });
      //   const callbackQueryId = msg.id;
      //   const text = "Неверно, Верный ответ...";
      //   const showAlert = true;

      //   bot.answerCallbackQuery(callbackQueryId, { text, showAlert });
    }

    // commands
    if (text === "/results") {
      let results = [];
      // console.log("newGroupStudent", newGroupStudent);
      newGroupStudent.forEach((studentId) => {
        let answerSum = {
          right: 0,
          error: 0,
          notData: 0,
        };
        testsID.forEach((testId) => {
          // console.log("testId", testId.answers);

          if (testId.answers.right.includes(Number(studentId))) {
            answerSum.right = answerSum.right + 1;
          }
          if (testId.answers.error.includes(Number(studentId))) {
            answerSum.error = answerSum.error + 1;
          }
          if (testId.answers.notData.includes(Number(studentId))) {
            answerSum.notData = answerSum.notData + 1;
          }
        });

        results.push({
          id: studentId,
          answerSum: answerSum,
        });
      });

      let sortListResults = results.sort((a, b) =>
        a.answerSum.right < b.answerSum.right ? 1 : -1
      );
      let text = `
Результати тестів:

`;
      sortListResults.forEach((student, i) => {
        let percent =
          student.answerSum.right /
          (student.answerSum.error +
            student.answerSum.notData +
            student.answerSum.right);
        let grade =
          percent < 0.2
            ? 6
            : percent < 0.3
            ? 7
            : percent < 0.5
            ? 8
            : percent < 0.7
            ? 9
            : percent < 0.8
            ? 10
            : percent < 0.9
            ? 11
            : percent >= 0.9
            ? 12
            : undefined;
        text += `
<b>${i + 1}. ${getNamesOneStudentByIdGroup(student.id)}</b>
✅ Правильних: ${student.answerSum.right}
❌ Неправильних: ${student.answerSum.error}
🔘 Немає відповіді: ${student.answerSum.notData}
% Правильних: ${percent.toFixed(2) * 100}%
<b>Оцінка: ${grade} балів</b>
 
`;
      });

      bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    }

    if (text === "/admin") {
      if (chatId == myId) {
        bot.sendMessage(
          chatId,
          "Адмін-панель. \nОберіть потрібну дію",
          keyboards.adminMain
        );
      }
    }

    if (text == "Підтвердити нову групу") {
      let newGroupNames = getNamesStudentByIdGroup(newGroupStudent);

      bot.sendMessage(
        chatId,
        "Група успішно створена. Усі учні в групі: " + newGroupNames,
        keyboards.adminMain
      );
    }

    if (text == "Підтвердити теми") {
      bot.sendMessage(
        chatId,
        "Відправте фото звіт заняття (код, результат, скріншоти)",
        keyboards.photoKeyboard
      );
    }

    if (text === "tts") {
      for (let i = 0; i < students.length; i++) {
        await drawResult(
          students[i].name + " " + students[i].lastName,
          students[i].quiz.lastResultMoney
        );
        await bot.sendPhoto(chatId, "./img/image20.png");
      }
    }
    if (text == "фф") {
      cc = await bot.sendPoll(
        chatId,
        "Title quiz",
        JSON.stringify(["variant1", "variant2", "variant3"]),
        {
          is_anonymous: false,
          type: "quiz",
          correct_option_id: 0,
          explanation: "Дивись хвилину 38-40",
        }
      );
    }
    if (text == "a") {
      idMsgThemes = lastMsgId + 1;
      bot.sendMessage(
        chatId,
        "themes",
        keyboards.themesKeyboard2(currentThemes, formSoloImg.themes)
      );
    }
    if (text == "cc") {
      bot.sendMessage(chatId, "hello", keyboards.showQuiz());
    }
    if (text == "money") {
      let money = await addUserMoney(chatId, 10);
    }
    if (text == "Підтвердити дату") {
      bot.sendMessage(chatId, oldMessage);

      // bot.sendMessage(chatId, "d", keyboards.showQuiz());
    }

    if (text === "Підтвердити технології") {
      bot.sendMessage(
        chatId,
        "Оберіть пройдені теми та натисніть на кнопку підтвердження",
        keyboards.confirmThemes
      );
      bot.sendMessage(
        chatId,
        "Список усіх тем",
        keyboards.mainThemes(themes, "mainThemesIndex")
        // keyboards.keyboards.themesKeyboard2(themes[0].data, formSoloImg.themes)
      );
    }
    if (text == "Підтвердити фото" || text == "Без фото-звіту") {
      // let res = data.slice(8).split('_')
      // res.pop()
      // console.log(res)
      // let r = themes[res];
      // for (let i = 0; i < res.length; i++) {
      //   r = r[res[i]]

      // }
      // console.log('- - - - ');
      // console.log(r);
      // keyboards.themesKeyboard(r)
      // bot.sendMessage(chatId, 'ss', keyboards.themesKeyboard(r))
      bot.sendMessage(chatId, "Поставте оцінку", keyboards.gradeKeyboard());
    }

    if (text === "Підтвердити шаблон") {
      if (chatId == myId) {
        let msgForward = await bot.copyMessage(
          templateGroupId,
          chatId,
          msg.message_id - 1
        );

        bot.sendMessage(
          chatId,
          `Шаблон створено!`,
          keyboards.templateSuccess(groupId, msgForward.message_id)
        );
      }
    }

    oldMessage = text;
  }
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  let checkUser = await User.find({ idGroup: chatId });
  if (checkUser.length == 0) {
    return bot.sendMessage(chatId, "Ви не зареєстровані на навчання ❌");
  }
  let currentUser = await User.findOne({ idGroup: chatId });

  try {
    const jsonObject = JSON.parse(data);

    const data_ = JSON.parse(data);

    if (data_.d === "ScheduleDay") {
      const chatId = msg.message.chat.id;
      const messageId = msg.message.message_id;
      let users = await User.find({});
      // console.log(users)
      let bookedTimes = [];
      for (let i = 0; i < users.length; i++) {
        bookedTimes.push(users[i].days);
      }

      // Вызов функции с новым списком дней и получение обновленной клавиатуры
      const newReplyMarkup = keyboards.changeUserSchedule(
        bookedTimes,
        data_.days
      ).reply_markup;

      // Обновление сообщения с клавиатурой
      bot.editMessageReplyMarkup(newReplyMarkup, {
        chat_id: chatId,
        message_id: messageId,
      });
      bot.answerCallbackQuery(msg.id, {
        text: `✅ Обрані дні: ${data_.days.join(", ")}`,
      });
    }
    if (data_.d === "studentDelete") {
      const chatId = msg.message.chat.id;
      const messageId = msg.message.message_id;
      let users = await User.find({});
      let name = getNamesOneStudentByIdGroup(data_.id);
      bot.sendMessage(chatId, `Підтвердити видалення учня: <b>${name}</b>?`, {
        parse_mode: "HTML",
      });
    }

    if (jsonObject.d == "studentInfo") {
      let link = await bot.getChat(Number(jsonObject.id));
      let userCurrent = await User.find({ idGroup: jsonObject.id });
      console.log(userCurrent);
      bot.sendMessage(
        chatId,
        `Інформація про учня:
<b><a href="${link.invite_link}">${getNamesOneStudentByIdGroup(
          jsonObject.id
        )}</a></b>

Вік: .
Відвідуваність:
Індивідуальних занять: .
Змагань: .
Групових занять: .

Почав заняття: днів тому.
Середня оцінка: балів.
Всього алмазів: .
Індекс активності: .
Дата оплати: . 
Всього оплатив: .
Прийшов з: .
Кількість виконаних домашок: .
Контактні дані:

Вже вивчив теми:

        `,
        { parse_mode: "HTML" }
      );
    }

    if (jsonObject.data == "manageBalance") {
      bot.sendMessage(
        chatId,
        `
Ви бажаєте <b>додати</b> 💎 для користувача <b>${getNamesOneStudentByIdGroup(
          jsonObject.id
        )}</b>. 
Оберіть кількість алмазів:
      `,
        {
          parse_mode: "HTML",
          ...keyboards.balanceManageNumber(jsonObject.type, jsonObject.id),
        }
      );
    }

    if (jsonObject.d == "cb") {
      console.log("cb++++");
      if (jsonObject.t == "+") {
        console.log(jsonObject.i);
        addUserMoney(jsonObject.i, jsonObject.m);
        bot.sendMessage(
          chatId,
          `
Ви успішно додали <b>${
            jsonObject.m
          }</b>💎 для користувача <b>${getNamesOneStudentByIdGroup(
            jsonObject.i
          )}</b>
      `,
          {
            parse_mode: "HTML",
          }
        );
      }

      if (jsonObject.t == "-") {
        console.log(jsonObject.i);
        removeUserMoney(jsonObject.i, jsonObject.m);
        bot.sendMessage(
          chatId,
          `
Ви успішно зменшили кількість алмазів на <b>${
            jsonObject.m
          }</b>💎 для користувача <b>${getNamesOneStudentByIdGroup(
            jsonObject.i
          )}</b>
      `,
          {
            parse_mode: "HTML",
          }
        );
      }
    }
  } catch (e) {}

  if (data.startsWith("showDate")) {
    let d = data.split("_"); // showDate_🔴_ВТ_19:15

    let users = await User.find({});

    let names = {
      ПН: "Понеділок",
      ВТ: "Вівторок",
      СР: "Середа",
      ЧТ: "Четвер",
      ПТ: "П'ятниця",
      СБ: "Субота",
      НД: "Неділя",
    };

    for (let user of users) {
      for (let dayObj of user.days) {
        // Предполагая, что dayObj имеет поля day и time
        if (names[d[2]] === dayObj.day && d[3] === dayObj.time) {
          let studentName = getNamesOneStudentByIdGroup(user.idGroup);
          bot.sendMessage(
            chatId,
            `<b>⚠️ Цей час занятий.</b>
В ${names[d[2]]} о ${d[3]} займається учень: <b>${studentName}</b> `,
            { parse_mode: "HTML" }
          );
        }
      }
    }
  }
  if (data === "user-keyboard") {
    bot.sendMessage(
      chatId,
      "Клікни на кнопку щоб дізнатись як зробити потрібний символ на клавіатурі 👇",
      keyboards.keyboardSymbols
    );
  }
    if (data === "user-savedWork") {
      bot.sendMessage(
        chatId,
        "Поки що в тебе немає збережених робіт 😔",
      );
    }
  if (data === "user-elements") {
    bot.sendMessage(
      chatId,
      `Ось елементи які допоможуть тобі зробити свою, власну веб програму 👇`,
      {
        ...keyboards.elementsCategory,
        parse_mode: "HTML",
      }
    );
  }

  //  "startGame-NEWTHEME") {
  //  "startGame-OLDTHEME") {
  //  "startGame-INDIV") {
  //  "startGame-WORK") {
  //  "startGame-GROUP") {
  //  "startGame-TEST") {
  //  "startGame-PRACTICE") {
  //  "startGame-VIDEO") {

  if (data.startsWith("startGame")) {
    let variant = data.split("-")[1];
    console.log(variant);
    bot.sendMessage(chatId, `Гра ${variant} починається!`);

    switch (variant) {
      case "NEWTHEME":
        break;
      case "OLDTHEME":
        
        break;
      case "INDIV":
        
        break;
      case "WORK":
        
        break;
      case "GROUP":
        
        break;
      case "TEST":
         for (let test of themes[0].data[0].details.tests) {
           let idTest = uuid().slice(0, 8);
           await bot.sendPhoto(chatId, await testsImage(test.title), {
             caption: "<b>" + test.title + "</b>",
             ...keyboards.createTest(test.options, idTest),
             parse_mode: "HTML",
           });
         }
        
        break;
      case "PRACTICE":
        
        break;
      case "VIDEO":
        
        break;
      default:
        break;
    }
  }

  if (data.startsWith("soloTheme")) {
    let body = data.split("-")[1];
    let res = findPath(themes, body);
    const value = accessNestedObject(themes, res.slice(0, res.length - 1));
    console.log("Значение по указанному пути:", value);
    console.log(res);
     createLearnTheme(value, chatId);
  }
  if (data == "user-changeSchedule") {
    let users = await User.find({});
    // console.log(users)
    let bookedTimes = [];
    for (let i = 0; i < users.length; i++) {
      bookedTimes.push(users[i].days);
    }
    bot.sendMessage(
      chatId,
      `
Зараз ваш розклад індивідуальних занять виглядає так:


<b>Умовні позначення:</b>
🔴 - Занято
🟠 - Занято лише на 1 раз

⚪️ - Вільно
🔘 - Вільно лише 1 раз

👨‍🎓 - Індивідуальне заняття
👥 - Заняття в групі
🏆 - Змагання з програмування
📹 - Відео матеріали
✅ - Тестові завдання
👨‍💻 - Практичне завдання

- Практичне завдання
<b>Ось мій актуальний розклад 👇</b>
    
    `,
      {
        parse_mode: "HTML",
        ...keyboards.changeUserSchedule(bookedTimes),
      }
    );
  }

  if (data.startsWith("correct")) {
    bot.answerCallbackQuery(msg.id, {
      text: "✅ Вірно!",
      show_alert: false,
    });
    let word = msg.data.slice(8);
    let currentUser = await User.findOne({ idGroup: chatId });
    await User.findOneAndUpdate(
      { idGroup: chatId },
      { $push: { english: word } }
    );
    await currentUser.save();
    let countEngWord = 0;

    console.log(currentUser.english);
    for (let i = 0; i < currentUser.english.length; i++) {
      if (word == currentUser.english[i]) {
        countEngWord++;
      }
    }
    let uaWord;

    for (let i = 0; i < englishWords.length; i++) {
      if (englishWords[i].english == word) {
        uaWord = englishWords[i].ukranian;
      }
    }
    bot.deleteMessage(chatId, msg.message.message_id);
    if (countEngWord == 4) {
      await drawEnglish(
        word,
        uaWord,
        getNamesOneStudentByIdGroup(chatId).toUpperCase()
      );
      addUserMoney(chatId, 55);
      let cap = `
<b>Вітаю!</b>
Ти вивчив нове англійське слово:
<b>🇺🇸 ${word} - 🇺🇦 ${uaWord}</b>

Такими темпами ти скоро станеш крутим IT cпеціалістом!
      
      `;
      bot.sendPhoto(chatId, "./img/english-new-word-result.png", {
        parse_mode: "HTML",
        caption: cap,
        ...keyboards.englishNextWord(),
      });
    } else {
      const questionData = generateQuestion();

      const options = questionData.options.map((word) => word.ukranian);
      const correctAnswer = questionData.correctWord.ukranian;
      let engWord = questionData.correctWord.english;

      const inlineKeyboard = options.map((option, index) => [
        {
          text: option,
          callback_data:
            option === correctAnswer
              ? "correct-" + engWord
              : "wrong-" + engWord,
        },
      ]);

      bot.sendMessage(chatId, `Як перекладається слово ${engWord}?`, {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      });
    }
  }
  if (data.startsWith("wrong")) {
    bot.answerCallbackQuery(msg.id, {
      text: "❌ Неправильно",
      show_alert: false,
    });
    console.log(msg.data.slice(6));
  }

  if (
    data == "english-tests" ||
    data == "english-next-word" ||
    data == "english-learn"
  ) {
    const questionData = generateQuestion();

    const options = questionData.options.map((word) => word.ukranian);
    const correctAnswer = questionData.correctWord.ukranian;
    const engWord = questionData.correctWord.english;

    const inlineKeyboard = options.map((option, index) => [
      {
        text: option,
        callback_data:
          option === correctAnswer ? "correct-" + engWord : "wrong-" + engWord,
      },
    ]);

    bot.sendMessage(chatId, `Як перекладається слово ${engWord}?`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  if (data == "english-nullable-progress") {
    bot.sendMessage(
      chatId,
      "❗️ Після цієї операції вам доведеться почати спочатку вивчення усіх англійських слів.\n\n<b>Ви хочете онулити ваш прогрес?</b>",
      {
        parse_mode: "HTML",
        ...keyboards.confirmEnglishNullable(),
      }
    );
  }

  // english-save-progress
  if (data == "english-save-progress") {
    bot.sendMessage(
      chatId,
      "Твій прогрес залишився збереженим. Продовжуй розвиватись далі!"
    );
  }
  if (data == "english-nullable-progress-confirm") {
    let currentUser = await User.findOne({ idGroup: chatId });
    let engWord = currentUser.english;
    currentUser.english = [];
    await currentUser.save();
    bot.sendMessage(
      chatId,
      "🗑 Твій прогрес успішно очищений. \n🇺🇸 Можеш вивчати англійські слова з 0!"
    );
  }
  if (data == "english-statistics") {
    let currentUser = await User.findOne({ idGroup: chatId });
    let engWord = currentUser.english;

    // Створимо об'єкт для зберігання кількості входжень кожного слова
    let wordCount = {};

    // Підрахуємо кількість входжень кожного слова в список
    for (let word of engWord) {
      if (wordCount[word] === undefined) {
        wordCount[word] = 1;
      } else {
        wordCount[word]++;
      }
    }

    let successEngWord = "";
    let progressEngWord = "";
    let successEngWordCount = 0;
    let progressEngWordCount = 0;

    for (let word in wordCount) {
      if (wordCount[word] >= 5) {
        successEngWord += `✅  ${word} (${wordCount[word]}/5)\n`;
        successEngWordCount++;
      } else {
        progressEngWord += `⭐️ ${word} (${wordCount[word]}/5)\n`;
        progressEngWordCount++;
      }
    }

    bot.sendMessage(
      chatId,
      `
<b>Вивчені слова (${successEngWordCount}):</b>
${successEngWord}

<b>В процесі (${progressEngWordCount}):</b>
${progressEngWord}

      
      `,
      { parse_mode: "HTML", ...keyboards.nullableEnglishWords() }
    );
  }

  // bot.answerCallbackQuery(msg.id, "Хорошо");
  if (data.startsWith("elements-")) {
    let element = data.slice(9);
    if (!elementsData[element]) {
      return bot.sendMessage(
        chatId,
        `В категорії <b>${element}</b> поки що немає елементів`,
        {parse_mode: 'HTML'}
      );
    }
    let el = elementsData[element].variants[0];
    let templateElementsText = `
<b>${el.title}</b>

<u><b>index.html</b></u>

<pre>${escapeHTML(el.code["index.html"])}</pre>
    `;
    await bot.sendMessage(chatId, elementsData[element].description, {parse_mode: 'HTML'});
    await bot.sendPhoto(chatId, el.result, {
      parse_mode: "HTML",
      ...keyboards.code(el.id, element, elementsData[element].variants.length),
      caption: templateElementsText,
    });
  }

  if (data.startsWith("code")) {
    let actionElement = data.split("//")[1];
    let dataElement = data.split("//")[2];
    let idElement = data.split("//")[3];

    console.log(actionElement);
    console.log(dataElement);
    console.log(idElement);

    if (actionElement == "STYLE") {
      for (let i = 0; i < elementsData[dataElement].variants.length; i++) {
        if (elementsData[dataElement].variants[i].id == idElement) {
          let templateElementsText = `
<b>${elementsData[dataElement].variants[i].title}</b>

<u><b>style.css</b></u>

<pre>${escapeHTML(
            elementsData[dataElement].variants[i].code["style.css"]
          )}</pre>
    `;

          console.log(elementsData[dataElement].variants[i].result);

          const newPhotoUrl = elementsData[dataElement].variants[i].result;

          const media = {
            type: "photo",
            media: newPhotoUrl,
            caption: templateElementsText,

            parse_mode: "HTML",
          };

          bot
            .editMessageMedia(media, {
              chat_id: chatId,
              message_id: msg.message.message_id,
              ...keyboards.code(
                elementsData[dataElement].variants[i].id,
                dataElement,
                elementsData[dataElement].variants.length,
                i + 1,
                "style.css"
              ),
            })
            .then(() => {})
            .catch((error) => {});
        }
      }
    }

    if (actionElement == "INDEX") {
      for (let i = 0; i < elementsData[dataElement].variants.length; i++) {
        if (elementsData[dataElement].variants[i].id == idElement) {
          let templateElementsText = `
<b>${elementsData[dataElement].variants[i].title}</b>

<u><b>index.html</b></u>

<pre>${escapeHTML(
            elementsData[dataElement].variants[i].code["index.html"]
          )}</pre>
    `;

          console.log(elementsData[dataElement].variants[i].result);

          const newPhotoUrl = elementsData[dataElement].variants[i].result;

          const media = {
            type: "photo",
            media: newPhotoUrl,
            caption: templateElementsText,

            parse_mode: "HTML",
          };

          bot
            .editMessageMedia(media, {
              chat_id: chatId,
              message_id: msg.message.message_id,
              ...keyboards.code(
                elementsData[dataElement].variants[i].id,
                dataElement,
                elementsData[dataElement].variants.length,
                i + 1,
                "index.html"
              ),
            })
            .then(() => {
              console.log("Message media edited");
            })
            .catch((error) => {
              console.log("Error in editing message media:", error);
            });
        }
      }
    }

    if (actionElement == "SCRIPT") {
      for (let i = 0; i < elementsData[dataElement].variants.length; i++) {
        if (elementsData[dataElement].variants[i].id == idElement) {
          let templateElementsText = `
<b>${elementsData[dataElement].variants[i].title}</b>

<u><b>script.js</b></u>

<pre>${escapeHTML(
            elementsData[dataElement].variants[i].code["script.js"]
          )}</pre>
    `;

          console.log(elementsData[dataElement].variants[i].result);

          const newPhotoUrl = elementsData[dataElement].variants[i].result;

          const media = {
            type: "photo",
            media: newPhotoUrl,
            caption: templateElementsText,

            parse_mode: "HTML",
          };

          bot
            .editMessageMedia(media, {
              chat_id: chatId,
              message_id: msg.message.message_id,
              ...keyboards.code(
                elementsData[dataElement].variants[i].id,
                dataElement,
                elementsData[dataElement].variants.length,
                i + 1,
                "script.js"
              ),
            })
            .then(() => {
              console.log("Message media edited");
            })
            .catch((error) => {
              console.log("Error in editing message media:", error);
            });
        }
      }
    }

    if (actionElement == "NEXT") {
      for (let i = 0; i < elementsData[dataElement].variants.length; i++) {
        if (elementsData[dataElement].variants[i].id == idElement) {
          if (i == elementsData[dataElement].variants.length - 1) {
            bot.answerCallbackQuery(msg.id, {
              text: "Більше елементів в цій категорії немає",
              show_alert: false,
            });
          } else {
            let templateElementsText = `
<b>${elementsData[dataElement].variants[i + 1].title}</b>

<u><b>index.html</b></u>

<pre>${escapeHTML(
              elementsData[dataElement].variants[i + 1].code["index.html"]
            )}</pre>
    `;

            console.log(elementsData[dataElement].variants[i + 1].result);

            const newPhotoUrl =
              elementsData[dataElement].variants[i + 1].result;

            const media = {
              type: "photo",
              media: newPhotoUrl,
              caption: templateElementsText,

              parse_mode: "HTML",
            };

            bot
              .editMessageMedia(media, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                ...keyboards.code(
                  elementsData[dataElement].variants[i + 1].id,
                  dataElement,
                  elementsData[dataElement].variants.length,
                  i + 2
                ),
              })
              .then(() => {
                console.log("Message media edited");
              })
              .catch((error) => {
                console.log("Error in editing message media:", error);
              });
          }
        }
      }
    }

    if (actionElement == "PREV") {
      for (let i = 0; i < elementsData[dataElement].variants.length; i++) {
        if (elementsData[dataElement].variants[i].id == idElement) {
          if (i == 0) {
            bot.answerCallbackQuery(msg.id, {
              text: "Більше елементів в цій категорії немає",
              show_alert: false,
            });
          } else {
            let templateElementsText = `
<b>${elementsData[dataElement].variants[i - 1].title}</b>

<u><b>index.html</b></u>

<pre>${escapeHTML(
              elementsData[dataElement].variants[i - 1].code["index.html"]
            )}</pre>
    `;

            console.log(elementsData[dataElement].variants[i - 1].result);

            const newPhotoUrl =
              elementsData[dataElement].variants[i - 1].result;

            const media = {
              type: "photo",
              media: newPhotoUrl,
              caption: templateElementsText,

              parse_mode: "HTML",
            };

            bot
              .editMessageMedia(media, {
                chat_id: chatId,
                message_id: msg.message.message_id,
                ...keyboards.code(
                  elementsData[dataElement].variants[i - 1].id,
                  dataElement,
                  elementsData[dataElement].variants.length,
                  i
                ),
              })
              .then(() => {})
              .catch((error) => {});
          }
        }
      }
    }

    if (actionElement == "VIDEO") {
      for (let i = 0; i < elementsData[dataElement].variants.length; i++) {
        if (elementsData[dataElement].variants[i].id == idElement) {
          bot.sendVideo(chatId, elementsData[dataElement].variants[i].video);
        }
      }
    }
  }

  if (data.startsWith("learnTheme")) {
    let variant = data.split("-")[1];
    let idTheme = data.split("-")[2];
    let dataTheme = JSON.parse(shortId.get(idTheme));
    console.log(dataTheme);
    if (variant == "video") {
      let amountVideo = dataTheme.video.length;
      if (amountVideo == 0) {
        await bot.sendMessage(chatId, "😔 На жаль, відео по цій темі ще немає");
      } else {
        let oldMessage = await bot.sendMessage(
          chatId,
          "⏳ Зачекайте, відео по даній темі завантажується..."
        );
        await bot.sendVideo(chatId, dataTheme.video[0].url);
        await bot.deleteMessage(chatId, oldMessage.message_id);
      }
    }
    if (variant == "tests") {
      bot.sendMessage(chatId, "Ось тести по даній темі:");

      for (let test of dataTheme.tests) {
        let idTest = uuid().slice(0, 8);
        await bot.sendPhoto(chatId, await testsImage(test.title), {
          caption: "<b>" + test.title + "</b>",
          ...keyboards.createTest(test.options, idTest),
          parse_mode: "HTML",
        });
      }
    }
    if (variant == "practice") {
      let oldMessage = await bot.sendMessage(
        chatId,
        "⏳ Зачекайте, практичне завдання по даній темі завантажується..."
      );

      console.log("currentThemesNew", dataTheme.tasks.practice);

      idPracticeTask = dataTheme.tasks.practice;

      for (let i = 0; i < idPracticeTask.length; i++) {
        let practiceTasks = await Practice.findOne({ id: idPracticeTask[i] });
        try {
          let templateObjectData = {
            output: "./img/practice-old.png",
            html: `<html>
  <body>
   ${practiceTasks.data.html}
   
  <style>
        ${practiceTasks.data.css}
  </style>

  </body>
  </html>
  
  `,
          };

          await nodeHtmlToImage(templateObjectData);

          let resultCSS = "";

          console.log("practiceTasks.data.html", practiceTasks);

          await nodeHtmlToImage({
            output: "./img/practice-result.png",
            html: `<html>
  <body>
   ${practiceTasks.data.html}
   ${practiceTasks.codeResult.html}
  <style>
      
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          padding: 20px;
          zoom: 150%;
        }
        ${practiceTasks.data.css}
        ${practiceTasks.codeResult.css}

  </style>
  </body>
  </html>
  
  `,
          }).then(() => console.log("The image was created successfully!"));

          await nodeHtmlToImage({
            output: "./img/practice-result-tobase64.png",
            html: `<html>
  <body>
  ${practiceTasks.data.html}
   ${practiceTasks.codeResult.html}
        <h1 class="template">ШАБЛОН</h1>
  <style>

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: sans-serif;
        }
        body {
          padding: 10px;
          width: 800px;
        }
        .template {
          font-size: 70px;
          font-weight: 100;
          position: absolute;
          top: 180px;
          left: 150px;
          letter-spacing: 30px;
          color: grey;
          transform: rotate(-45deg);
        }

         ${practiceTasks.data.css}
        ${practiceTasks.codeResult.css}
  </style>
  </body>
  </html>
  
  `,
          }).then(() => console.log("The image was created successfully!"));

          practiceList.push({
            idPractice: idPracticeTask[i],
            photo:
              "data:image/jpeg;base64," +
              (await imageToBase64("./img/practice-result-tobase64.png")),
            students: [],
          });

          let title = practiceTasks.name;
          let themes = practiceTasks.themes;
          let descriptionText = practiceTasks.description;
          let tasks = practiceTasks.tasks.title;
          let id = practiceTasks.id;
          await drawPracticeTask(title, descriptionText, themes, tasks);
          let tasksItems = "";
          practiceTasks.tasks.forEach((task) => {
            tasksItems += `▪️ ${task.title} ${task.label}
`;
          });

          let templateCaption = `
<b>${title}</b>
Опис:
<i>${descriptionText}</i>

<b>Завдання:</b>
${tasksItems}

Статус: <b>В роботі</b>
<pre>${id}</pre>

    `.slice(0, 1023);
          await drawPracticeTask(title, descriptionText, themes, tasks);

          let u = await User.findOne({ idGroup: chatId });
          console.log("car!!", u.car.currentCar);

          practiceList[i].students.push({
            idStudent: Number(chatId),
            car: u.car.currentCar,
            result: {
              successTask: [],
              wrongTask: [],
            },
            historyCode: [
              {
                html: "",
                css: "",
                js: "",
              },
            ],
            finish: false,
            grade: 6,
            time: 0,
            finishCode: {
              html: "",
              css: "",
              js: "",
            },
          });

          bot.sendPhoto(chatId, "./img/practice-result-canvas.png", {
            caption: templateCaption,
            ...keyboards.practiceKeyboard(chatId, idPracticeTask[i]),
            parse_mode: "HTML",
          });
        } catch (e) {}
      }

      await studentListPractice.insertMany(practiceList);
      practiceList = [];

      await bot.sendMessage(
        chatId,
        "⏳ Зачекайте, практичне завдання по даній темі завантажується..."
      );

      await bot.deleteMessage(chatId, oldMessage.message_id);
    }
    if (variant == "similarTags") {
      let tags = ``;
      for (let tag of dataTheme.similarTags) {
        tags += `\n🌟 ${tag}`;
      }
      bot.sendMessage(
        chatId,
        "<b>Ось схожі теми які корисно тобі вивчити:</b> " + tags,
        { parse_mode: "HTML" }
      );
    }
  }

  if (data == "regStudent") {
    newUserStatus = "name";
    bot.sendMessage(chatId, "Вкажіть ім'я учня");
  }
  if (data.startsWith("testAnswer-")) {
    console.log(msg);
    console.log(msg.message.message_id);
    console.log(msg.message.reply_markup);
    try {
      bot.editMessageReplyMarkup(
        keyboards.editTest(msg.message.reply_markup, msg.data, bot, chatId),
        {
          message_id: msg.message.message_id,
          chat_id: chatId,
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  if (newUserStatus) {
    if (newUserStatus == "schedule") {
      userDay = {
        day: "",
        time: "",
      };
      userDay.day = data.slice(9);
      bot.sendMessage(chatId, "Вкажіть час занять", keyboards.keyboardTimeWeek);
      newUserStatus = "time";
    } else if (newUserStatus == "time") {
      userDay.time = data.slice(9);
      newUserStatus = "nextDay";
      newUser.days.push(userDay);
      userDay = [];
      bot.sendMessage(
        chatId,
        "Бажаєте додати ще один день занять?",
        keyboards.keyboardIsNextDay
      );
      newUserStatus = "nextDay!";
    } else if (newUserStatus == "nextDay!") {
      if (data == "nextDayTrue") {
        newUserStatus = "group";
        bot.sendMessage(
          chatId,
          "Вкажіть дні та години в які будуть проходити заняття",
          keyboards.keyboardDaysWeek
        );
        newUserStatus = "schedule";
      }
      if (data == "nextDayFalse") {
        newUserStatus = "idGroup";
        bot.sendMessage(chatId, "Вкажіть вартість навчання за місяць");
      }
    }
  }

  if (data.startsWith("deleteThemes-")) {
    try {
      let theme = data.slice(13);
      formSoloImg.themes.splice(theme, 1);
      bot.sendMessage(chatId, "Тема: <b>" + theme + "</b> успішно видалена!", {
        parse_mode: "HTML",
      });
    } catch (e) {}
  }

  if (data.startsWith("infoStudent-")) {
    try {
      let getId = data.slice(12);
      let link = await bot.getChat(Number(getId));
      bot.sendMessage(chatId, link.invite_link);
    } catch (e) {}
  }

  if (data.startsWith("mainThemesIndex-")) {
    let themeIndex = data.slice(16);
    currentThemes = themes[themeIndex].data;

    formSoloImg.themes.push("++" + themes[themeIndex].title);

    bot.sendMessage(
      chatId,
      "Тема заняття: <b>" + themes[themeIndex].title + "</b> обрана!",
      {
        ...keyboards.themesKeyboardSolo(currentThemes, formSoloImg.themes),
        parse_mode: "HTML",
      }
    );
  }
  if (data.startsWith("newTheme-")) {
    let themeIndex = data.slice(9);
    currentThemes = themes[themeIndex].data;

    formSoloImg.themes.push("++" + themes[themeIndex].title);

    bot.sendMessage(
      chatId,
      "Тема: <b>" + themes[themeIndex].title + "</b> обрана!",
      {...keyboards.themesKeyboard2(currentThemes, formSoloImg.themes,), parse_mode: 'HTML'}
    );
  }
  if (data == "balanceStudent") {
    bot.sendMessage(
      chatId,
      "Оберіть учня щоб додати або відняти алмази:",
      await keyboards.chooseStudents("balance")
    );
  }
  if (data.startsWith("balance-/-")) {
    let splitData = data.split("-/-");
    let id = splitData[splitData.length - 1];
    bot.sendMessage(
      chatId,
      `Учень <b>${getNamesOneStudentByIdGroup(id)}</b> обраний. 
Ви хочете додати алмази чи відняти?`,
      { parse_mode: "HTML", ...keyboards.adminManageBalance(id) }
    );
  }

  if (data == "sendTests") {
    currentThemes = themes[0];
    bot.sendMessage(
      chatId,
      "Оберіть по яким темам мають бути питання:",
      keyboards.themesKeyboard2(currentThemes, formSoloImg.themes)
    );
    typeThemes = "tests";
  }
  if (data == "sendPractice") {
    currentThemes = themes[0];
    bot.sendMessage(
      chatId,
      "Оберіть по яким темам мають бути питання:",
      keyboards.themesKeyboard2(currentThemes, formSoloImg.themes)
    );
    typeThemes = "practice";
  }

  if (data.startsWith("deleteTemplate-")) {
    bot.deleteMessage(templateGroupId, data.slice(15));
  }

  if (data.startsWith("newLesson-/-")) {
    let dataList = data.split("-/-");
    let name = dataList[1];
    formSoloImg.idGroup = dataList[2];
    formSoloImg.name = name;

    let currentDate = time.day + "." + time.month + "." + time.year;

    bot.sendMessage(
      chatId,
      "Учень: <b>" +
        name +
        "</b> обраний. \nПідтвердіть дату, або напишіть свою: ",
      { parse_mode: "HTML" }
    );
    bot.sendMessage(chatId, currentDate, keyboards.confirmDate(currentDate));
  }
  if (data.startsWith("themesIndex")) {
    try {
      let dat = data.split('-')[1]
      if (data.startsWith("themesIndexsolo")) {
        console.log(dat)
        let activeObjectTheme = currentThemes[dat];
        console.log(currentThemes[dat]);

          formSoloImg.themes.push(activeObjectTheme);
      }
      if (typeThemes == "learn") {
        let currentTheme = currentThemes[+data.slice(12)].details;
        createLearnTheme(currentTheme, chatId)
      }

      if (typeThemes == "tests") {
        let currentThemesNew = currentThemes[+data.slice(12)];
        console.log("444");
        let ddata = currentThemesNew.details.tests;

        for (let i = 0; i < ddata.length; i++) {
          let idTest = uuid().slice(0, 8);
          let options = currentThemesNew.details.tests[i].options;
          let rightAnswer = options[0];
          let optionsText = [];
          let newOptions_ = [...options];
          let newOptions = shuffle(newOptions_);
          newOptions.forEach((option) => {
            optionsText.push(`\n▪️ ${option}`);
          });
          let studentsCurrent = getNamesStudentByIdGroup(newGroupStudent);
          let prettyStudents = "";
          studentsCurrent.forEach((student) => {
            prettyStudents += `\n<b>${student}</b>`;
          });
          let title = currentThemesNew.details.tests[i].title;
          let infoMessage = `
<b>${title}</b>
${optionsText}

Відповіді учнів:
${prettyStudents}

Правильна відповідь:
<span class="tg-spoiler"><b>${rightAnswer}</b></span>
id: ${idTest}
        `;

          let message = await bot.sendMessage(chatId, infoMessage, {
            parse_mode: "HTML",
          });

          let idMessage = message.message_id;
          testsID.push({
            idQuiz: idTest,
            idMessage: idMessage,
            answers: {
              right: [],
              error: [],
              notData: [],
            },
            title: title,
            options: optionsText,
            rightAnswer: rightAnswer,
          });
          await testsImage(title);

          newGroupStudent.forEach(async (id) => {
            bot.sendPhoto(id, "./img/tests-create.png", {
              caption: "<b>" + ddata[i].title + "</b>",
              ...keyboards.createTest(ddata[i].options, idTest),
              parse_mode: "HTML",
            });
          });
        }
      }

      if (typeThemes == "practice") {
        console.log(data); // themesIndex-70
        // let idPracticeTask = [1];
        let currentThemesNew = currentThemes[+data.slice(12)];
        console.log(
          "currentThemesNew",
          currentThemesNew.details.tasks.practice
        );
        idPracticeTask = currentThemesNew.details.tasks.practice;
        /* 


        details: {
          title: 'title',
          speedCode: 'title',
          description: '\n' +
            "<b>title</b> - В цей тег ми пишемо контактну інформацію, наприклад адресу, номер телефону, електронну адресу, соціальні мережі, наш сайт, ім'я, прізвище.\n" +
            'Тег address є семантичним, тобто має сенс.\n' +
            "Цей елемент з'явився в останній, 5 версії HTML. До 2015 року його не було.\n" +
            '        ',
          tasks: { speed: [Array] },
          tests: [ [Object] ],
          default: {
            figma: [Array],
            images: [Array],
            sandbox: [Array],
            code: [Array]
          },
          amount: 0,
          similarTags: [ 'article', 'time' ],
          links: [ [Object], [Object] ]
        },
        childrens: []
      }

        */

        for (let i = 0; i < idPracticeTask.length; i++) {
          let practiceTasks = await Practice.findOne({ id: idPracticeTask[i] });
          try {
            let templateObjectData = {
              output: "./img/practice-old.png",
              html: `<html>
  <body>
   ${practiceTasks.data.html}
   
  <style>
        ${practiceTasks.data.css}
  </style>

  </body>
  </html>
  
  `,
            };

            await nodeHtmlToImage(templateObjectData);

            let resultCSS = "";

            console.log("practiceTasks.data.html", practiceTasks);

            await nodeHtmlToImage({
              output: "./img/practice-result.png",
              html: `<html>
  <body>
   ${practiceTasks.data.html}
   ${practiceTasks.codeResult.html}
  <style>
      
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          padding: 20px;
          zoom: 150%;
        }
        ${practiceTasks.data.css}
        ${practiceTasks.codeResult.css}

  </style>
  </body>
  </html>
  
  `,
            }).then(() => console.log("The image was created successfully!"));

            await nodeHtmlToImage({
              output: "./img/practice-result-tobase64.png",
              html: `<html>
  <body>
  ${practiceTasks.data.html}
   ${practiceTasks.codeResult.html}
        <h1 class="template">ШАБЛОН</h1>
  <style>

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: sans-serif;
        }
        body {
          padding: 10px;
          width: 800px;
        }
        .template {
          font-size: 70px;
          font-weight: 100;
          position: absolute;
          top: 180px;
          left: 150px;
          letter-spacing: 30px;
          color: grey;
          transform: rotate(-45deg);
        }

         ${practiceTasks.data.css}
        ${practiceTasks.codeResult.css}
  </style>
  </body>
  </html>
  
  `,
            }).then(() => console.log("The image was created successfully!"));

            practiceList.push({
              idPractice: idPracticeTask[i],
              photo:
                "data:image/jpeg;base64," +
                (await imageToBase64("./img/practice-result-tobase64.png")),
              students: [],
            });

            let title = practiceTasks.name;
            let themes = practiceTasks.themes;
            let descriptionText = practiceTasks.description;
            let tasks = practiceTasks.tasks.title;
            let id = practiceTasks.id;
            await drawPracticeTask(title, descriptionText, themes, tasks);
            let tasksItems = "";
            practiceTasks.tasks.forEach((task) => {
              tasksItems += `▪️ ${task.title} ${task.label}
`;
            });

            let templateCaption = `
<b>${title}</b>
Опис:
<i>${descriptionText}</i>

<b>Завдання:</b>
${tasksItems}

Статус: <b>В роботі</b>
<pre>${id}</pre>

    `.slice(0, 1023);
            await drawPracticeTask(title, descriptionText, themes, tasks);

            newGroupStudent.forEach(async (id) => {
              let u = await User.findOne({ idGroup: chatId });

              practiceList[i].students.push({
                idStudent: Number(id),
                car: u.car.currentCar,
                result: {
                  successTask: [],
                  wrongTask: [],
                },
                historyCode: [
                  {
                    html: "",
                    css: "",
                    js: "",
                  },
                ],
                finish: false,
                grade: 6,
                time: 0,
                finishCode: {
                  html: "",
                  css: "",
                  js: "",
                },
              });

              bot.sendPhoto(id, "./img/practice-result-canvas.png", {
                caption: templateCaption,
                ...keyboards.practiceKeyboard(id, idPracticeTask[i]),
                parse_mode: "HTML",
              });
            });
          } catch (e) {}
        }

        await studentListPractice.insertMany(practiceList);
        practiceList = [];

        // console.log(practiceList);
      } 
      else if (typeThemes == "tests") {
        let currentThemesOld = currentThemes[+data.slice(12)];
        currentThemes = currentThemes[+data.slice(12)].childrens;
        if (currentThemes.length == 0) {
          currentThemes = themes[0].data;

          formSoloImg.themes.push(currentThemesOld.details.title);

          let readyThemes = [];
          formSoloImg.themes.forEach((item) => {
            readyThemes.push(`\n▪️ ${item}`);
          });
          bot.deleteMessage(chatId, msg.message.message_id);
          bot.deleteMessage(chatId, msg.message.message_id - 1);
          bot.sendMessage(
            chatId,
            `Тема <b>${currentThemesOld.details.title}</b> обрана! 
  
Список обраних тем на зараз:
${readyThemes}

Оберіть наступну тему, або натисніть на кнопку для підтвердження:`,
            {
              parse_mode: "HTML",
              ...keyboards.themesKeyboard2(currentThemes, formSoloImg.themes),
            }
          );
        } else {
          bot.sendMessage(
            chatId,
            "Оберіть підтему:",
            keyboards.themesKeyboard2(currentThemes, formSoloImg.themes)
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
    bot.answerCallbackQuery(msg.id);
  }

  if (data == "getMoney") {
    bot.sendMessage(
      chatId,
      "Відправте ваш номер картки (будь якого банку). На цю картку вам прийдуть кошти",
      { parse_mode: "HTML" }
    );
    waitCardNumber = true;
  }

  if (data == "car-shop") {
    let myCars = currentUser.car.myCars;

    indexCar = 0;
    showCarShop(indexCar, chatId, myCars);
  }

  if (data.startsWith("carshop")) {
    let action = data.split("-")[1];
    let idCar = data.split("-")[2];
    let myCars = currentUser.car.myCars;

    if (action == "left") {
      if (indexCar > 0) {
        indexCar--;
        showCarShop(indexCar, chatId, myCars);
      } else {
        bot.answerCallbackQuery(msg.id, {
          text: "Автомобілів більше немає(",
          show_alert: false,
        });
      }
    } else if (action == "right") {
      if (indexCar < cars.length - 1) {
        indexCar++;
        showCarShop(indexCar, chatId, myCars);
      } else {
        bot.answerCallbackQuery(msg.id, {
          text: "Автомобілів більше немає(",
          show_alert: false,
        });
      }
    } else if (action == "price") {
      bot.answerCallbackQuery(msg.id, {
        text: "Ціна автомобіля - " + cars[idCar].price + " 💎",
        show_alert: false,
      });
    } else if (action == "buy") {
      let currentCars = currentUser.car.myCars;
      currentCars.push(cars[idCar].img);
      let price = cars[idCar].price;
      console.log(1212);
      console.log(price);
      console.log(currentCars);
      console.log(currentUser.diamonds);
      if (currentUser.diamonds >= price) {
        await User.updateOne(
          { idGroup: chatId },
          { $set: { diamonds: currentUser.diamonds - price } }
        );
        await User.updateOne(
          { idGroup: chatId },
          { $set: { "car.myCars": currentCars } }
        );
        bot.sendMessage(
          chatId,
          `
<b>🥳 Вітаю!</b> Ти купив автомобіль ${cars[idCar].title} за ${
            cars[idCar].price
          } 💎!
<b>Твій баланс зараз:</b> ${currentUser.diamonds - price}
        `,
          { parse_mode: "HTML", ...keyboards.carKb() }
        );
      } else {
        console.log(678);
        bot.answerCallbackQuery(msg.id, {
          text: "Не вистачає алмазів ❌",
          show_alert: true,
        });
      }
    }
  }

  if (data.startsWith("car-garage-e-")) {
    let car_ = data.slice(13);
    let allCars = currentUser.car.myCars;
    // Обновляем currentCar на значение автомобиля, соответствующего нажатой кнопке
    const newCurrentCar = car_; // определите значение из callback_data или каким-либо другим способом

    // Получаем обновленную клавиатуру
    const updatedKeyboard = keyboards.garageActionsKb(allCars, newCurrentCar);

    await User.updateOne(
      { idGroup: chatId },
      { $set: { "car.currentCar": car_ } }
    );

    // Обновляем сообщение с новой клавиатурой
    bot.editMessageText(`Автомобіль <b>${car_}</b> обраний!`, {
      chat_id: chatId,
      message_id: msg.message.message_id,
      ...updatedKeyboard,
      parse_mode: "HTML",
    });
  }

  if (data == "car-garage") {
    let allCars = currentUser.car.myCars;
    let currentCar = currentUser.car.currentCar;

    bot.sendMessage(
      chatId,
      `
<b>Всього автомобілів в гаражі:</b> ${allCars.length} (з ${cars.length})
<b>Усі ваші автомобілі:</b> ${allCars}

<b>Ти можеш обрати активний автомобіль 👇</b>
`,
      { parse_mode: "HTML", ...keyboards.garageActionsKb(allCars, currentCar) }
    );
  }
  if (data.startsWith("user-")) {
    let text = data.slice(5);

    if (text == "getCoins") {
      let currentUser = await User.findOne({ idGroup: chatId });
      console.log(currentUser);
      bot.sendMessage(
        chatId,
        `
<b>Привіт! Зараз в тебе на балансі:</b>
💎 ${currentUser.diamonds} алмазів
💵 ${currentUser.quiz.currentMoney} грн 


<b>Ти можеш заробити 💎 вже зараз! 
Просто натисни який варіант заробітку тобі подобається:</b>

<b>Вивчити нову тему</b> 
🤑 250 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_NEWTHEME"> ПОЧАТИ → </a>

<b>Повторити стару тему</b>
🤑 180 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_OLDTHEME"> ПОЧАТИ → </a>

<b>Індивідуальне заняття </b>
🤑 350 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_INDIV"> ПОЧАТИ → </a>

<b>Показати будь-яку роботу</b>
🤑 500 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_WORK"> ПОЧАТИ → </a>

<b>Групові заняття</b>
🤑 150 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_GROUP"> ПОЧАТИ → </a>

<b>Тестові завдання</b>
🤑 20 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_TEST"> ПОЧАТИ → </a>

<b>Практичні завдання</b>
🤑 150 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_PRACTICE"> ПОЧАТИ → </a>

<b>Перегляд відео по понеділкам</b>
🤑 250 💎 <a href="https://t.me/DimaNice_Bot?start=MONEY_VIDEO"> ПОЧАТИ → </a>


Успіхів!
    `,
        {
          parse_mode: "HTML",
        }
      );
    }
    if (text == "changeCar") {
      let currentUser = await User.findOne({ idGroup: chatId });
      console.log(currentUser.car);
      let urlPhoto = "./img/cars/" + currentUser.car.currentCar;

      // Чтение SVG-файла
      const svgData = fs.readFileSync(urlPhoto);

      // Конвертировать SVG в PNG
      sharp(svgData)
        .resize(600)
        .png()
        .toFile("output-svg.png")
        .then((data) => {
          // Отправить PNG изображение
          bot.sendPhoto(chatId, "./output-svg.png", {
            caption: `Твій автомобіль зараз виглядає так ☝️`,
            ...keyboards.carKb(),
          });
        });
    }
    if (text == "balance") {
      let currentUser = await User.findOne({ idGroup: chatId });
      console.log(currentUser);
      if (currentUser) {
        bot.sendMessage(
          chatId,
          `
<b>Привіт! Зараз в тебе на балансі:</b>
💎 ${currentUser.diamonds} алмазів
💵 ${currentUser.quiz.currentMoney} грн 

▪️ за весь час ти заробив ${currentUser.quiz.allMoney} грн
▪️ за останнє змагання ти заробив ${currentUser.quiz.lastResultMoney} грн

<b>Ти можеш заробити 💵:</b>
▪️ Приєднуючись на змагання щочетверга о 20:00 за Київським часом.

<b>Ти можеш заробити 💎 за:</b>
▪️ Індивідуальні заняття
▪️ На індивідуальному занятті показавши будь-яку роботу
▪️ Групові заняття
▪️ Щоденні тестові завдання
▪️ Щоденні практичні завдання
▪️ Перегляд відео

    `,
          {
            parse_mode: "HTML",
            ...keyboards.keyboardGetMoney,
          }
        );
      } else {
        bot.sendMessage(
          chatId,
          "Користувача не знайдено.",
          keyboards.keyboardTask
        );
      }
    }
    if (text == "english") {
      let currentUser = await User.findOne({ idGroup: chatId });

      let a = [];
      let count = 0;

      let counts = {};
      let result = [];

      // Подсчет элементов
      for (let i = 0; i < currentUser.english.length; i++) {
        counts[currentUser.english[i]] =
          (counts[currentUser.english[i]] || 0) + 1;
      }

      // Фильтрация массива
      for (let key in counts) {
        if (counts[key] >= 5) {
          result.push(Number(key));
        }
      }

      let learnedWords = result.length; // количество изученных слов
      let totalWords = englishWords.length; // общее количество слов

      let percentage = (learnedWords / totalWords) * 100;

      bot.sendMessage(
        chatId,
        `
<b>Зараз ти вже вивчив ${percentage.toFixed(2)}% необхідних слів</b>
(${learnedWords} слова з ${totalWords}):

⚠️ Слово вважається вивченим, якщо ви дали правильну відповідь принаймні 5 разів.

Продовжуй далі, і ти досягнеш успіху 💪
`,
        {
          parse_mode: "HTML",
          ...keyboards.english(englishWords),
        }
      );
      typeThemes = "learn";
    }
    if (text == "newTheme") {
      bot.sendMessage(
        chatId,
        `<b>💻 Напочатку обери технологію яка тобі зараз цікава.</b>
<i>Наприклад HTML, CSS, javascript або іншу 👇</i>
        `,
        {
          parse_mode: "HTML",
          ...keyboards.mainThemes(themes, "newTheme"),
        }
      );
      typeThemes = "learn";
    }
    if (text == "getTasks") {
      bot.sendMessage(chatId, "Оберіть завдання", keyboards.keyboardTask);
    }
    if (text == "savedWork") {
    }
    if (text == "successes") {
    }
    if (text == "myGrade") {
    }
    if (text == "getCoins") {
    }
    if (text == "gpt") {
      modeGPT = true;
      let gptTips = `<b>Ось декілька порад як краще написати запит Штучному Інтелекту:</b>


▪️ <b>Чіткість питання.</b>
Опишіть проблему коротко та ясно.

▪️ <b>Надайте контекст.</b>
Що ви намагаєтеся досягти з цим кодом?

▪️ <b>Приклад коду.</b>
Надайте короткий фрагмент коду, який викликає проблему. Оптимально: 10-20 рядків. Якщо код більший, намагайтеся відтворити проблему в меншому обсязі.

▪️ <b>Помилки.</b>
Якщо у вас є помилки, надайте повне повідомлення про помилку.

▪️ <b>Очікувані та реальні результати.</b>
Опишіть, який результат ви очікуєте від коду і що ви отримали насправді.

▪️ <b>Зроблені спроби.</b>
Що ви вже спробували, щоб вирішити проблему?

▪️ <b>Форматування.</b>
Щоб ваш код був читабельний, використовуйте обрамлення для коду при надсиланні.


<b>Напиши своє питання Chat GPT 👇</b>
<i>⚠️ На сьогодні залишилось спроб 8/10:</i>
`;
      bot.sendMessage(chatId, gptTips, { parse_mode: "HTML" });
    }

    if (text == "schedule") {
    }
    if (text == "changeSchedule") {
    }
    if (text == "statistics") {
      bot.sendMessage(
        chatId,
        `
<b>Вітаю вас в розділі Статистика.</b>

Оберіть період за який вас цікавить отримати статистику про ваші досягнення 👇
       `,
        { parse_mode: "HTML", ...keyboards.statPeriod(chatId) }
      );
    }
    if (text == "competitions") {
      let currentUser = await User.findOne({ idGroup: chatId });

      if (currentUser) {
        let curMoney = currentUser.quiz.currentMoney;
        let kbMoney = {};
        let moneyText =
          "⚠️ Щоб вивести кошти на картку вам необхідно назбирати мінімум 300 грн.";
        if (curMoney >= 300) {
          moneyText =
            '🥳 Вітаю! Ви вже можете вивести ваші кошти. Тисніть кнопку "зняти кошти" та вкажіть номер картки!';
          kbMoney = keyboards.getMoney(curMoney);
        }
        bot.sendMessage(
          chatId,
          `
На вашому балансі
${curMoney} грн

<i>${moneyText}</i>
    `,
          { parse_mode: "HTML", ...kbMoney }
        );
      }
    }
    if (text == "pay") {
      bot.sendMessage(
        chatId,
        `
<b>Ваш план:</b> грн на місяць 
<b>Ви вже оплатили період:</b> з по .
<b>Дата оплати за наступний місяць:</b> 
(очікуємо оплату вже 3 дні).

<b>Також ви можете перейти на тариф:</b> 
👥 Навчання у групі
☄️ Старт (1 індивідуальне)
💻 Прогер (2 індивідуальних)
😎 Профі (3 індивідуальних)

<b>Дізнатись детальніше про варіанти навчання 👇</b> 
`,
        { parse_mode: "HTML", ...keyboards.detailsVariantsTraining() }
      );
    }
    if (text == "program") {
      bot.sendMessage(
        chatId,
        `
<b>Ось програма курсу 👇</b>

`,
        { ...keyboards.keyboardStudentsSettings, parse_mode: "HTML" }
      );
    }
    if (text == "settings") {
      bot.sendMessage(
        chatId,
        `
<b>⚙️ Ви в меню налаштувань.</b>

Оберіть що саме бажаєте змінити 👇
`,
        {
          ...keyboards.keyboardStudentsSettings,
          parse_mode: "HTML",
        }
      );
    }
  }

  if (data.startsWith("themesBack")) {
    bot.sendMessage(
      chatId,
      "Оберіть пройдені теми та натисніть на кнопку підтвердження",
      keyboards.confirmThemes
    );
    bot.sendMessage(
      chatId,
      "Список усіх тем",
      keyboards.mainThemes(themes, "mainThemesIndex")
      // keyboards.keyboards.themesKeyboard2(themes[0].data, formSoloImg.themes)
    );
  }

  if (data == "students") {
    let kb = await keyboards.chooseStudents("showStudent");
    let students = await User.find({});
    bot.sendMessage(
      chatId,
      `Зараз у вас навчається <b>${students.length} учнів</b>. 
Натисніть на ім'я щоб видалити або змінити дані учня 👇`,
      {
        parse_mode: "HTML",
        ...kb,
      }
    );
  }
  if (data == "pays") {
    let students = await User.find({});
    bot.sendMessage(
      chatId,
      `Інформація про оплати учнів:
В цьому місяці прибуток:

Вже прийшли кошти:
Ще мають прийти:
Оплати по датам:
`,
      {
        parse_mode: "HTML",
      }
    );
  }
  if (data == "adminEnglishStat") {
    console.log("012");
    bot.sendMessage(chatId, "Статистика вивчення англійських слів");
  }
  if (data == "registeredLesson") {
    bot.sendMessage(
      chatId,
      "Оберіть учня 👇",
      await keyboards.chooseStudents("newLesson")
    );
  }
  if (data == "createTemplate") {
    bot.sendMessage(
      chatId,
      "Відправте повідомлення, яке буде шаблоном для розсилки. Після цього натисніть: Готово",
      keyboards.confirmSave
    );
  }

  if (data == "quiz") {
    bot.sendMessage(
      chatId,
      `<b>Змагання розпочато.</b> 
    В змаганні приймають участь 5 людей: 
    
    `,
      keyboards.registeredQuiz
    ); // result(chatId)
  }

  if (data == "templates") {
    bot.sendMessage(
      chatId,
      "Оберіть необхідну дію",
      keyboards.templatesKeyboard
    );
  }
  if (data == "keyboards.themesDelete") {
    bot.sendMessage(
      chatId,
      "Оберіть теми для видалення",
      keyboards.themesDelete(formSoloImg.themes)
    );
  }
  if (data == "chooseAllStudent") {
    let users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      newGroupStudent.push(users[i].idGroup);
    }

    bot.sendMessage(chatId, "✅ Усі учні вибрані");
  }
  if (data == "createGroup") {
    bot.sendMessage(
      chatId,
      "Оберіть учнів:",
      await keyboards.chooseStudents("createGroup")
    );
    bot.sendMessage(chatId, "Оберіть учнів:", keyboards.confirmNewGroup);
  }

  if (data == "clearGroup") {
    await studentListPractice.deleteMany({});
    newGroupStudent = [];
    bot.sendMessage(chatId, "В групі немає людей");
  }

  if (data.startsWith("newGroupStudent-/-")) {
    let index = "newGroupStudent-/-".length;
    let studentGroupID = data.slice(index);

    newGroupStudent.push(studentGroupID);
    bot.sendMessage(
      chatId,
      "Учень: " + getNamesOneStudentByIdGroup(studentGroupID) + " обраний!",
      keyboards.confirmNewGroup
    );
  }

  if (data.startsWith("showStudent-/-")) {
    let index = "showStudent-/-".length;
    let studentGroupID = data.slice(index);

    newGroupStudent.push(studentGroupID);
    bot.sendMessage(
      chatId,
      `Ви обрали учня: <b>${getNamesOneStudentByIdGroup(studentGroupID)}</b>
Оберіть що саме бажаєте зробити 👇
      `,
      {
        parse_mode: "HTML",
        ...keyboards.studentChange(studentGroupID),
      }
    );
  }

  if (data.startsWith("selectTechnologies-")) {
    bot.answerCallbackQuery(msg.id);
    let newTechnology = data.slice(19);
    if (formSoloImg.technologies.includes(newTechnology)) {
      let index = formSoloImg.technologies.indexOf(newTechnology);
      formSoloImg.technologies.splice(index, 1);
    } else {
      formSoloImg.technologies.push(newTechnology);
    }
    let aa = keyboards.technologiesKeyboard(
      formSoloImg.technologies
    ).reply_markup;
    console.log(aa);
    bot.editMessageReplyMarkup(aa, {
      message_id: idMsgTechnologies - 1,
      chat_id: chatId,
    });
    bot.editMessageText(JSON.stringify(formSoloImg.technologies), {
      message_id: idMsgTechnologies,
      chat_id: chatId,
    });
  }

  if (data == "allTemplate") {
    for (let i = 0; i < templates.length; i++) {
      bot.forwardMessage(myId, groupId, templates[i].idMsg);
    }
  }
  if (data == "clearChat") {
    for (let i = lastMsgId; i > 0; i--) {
      try {
        bot.deleteMessage(chatId, i);
      } catch (e) {}
    }
  }

  if (data == "otherDateLesson") {
    viewCal(new Date().getFullYear(), new Date().getMonth(), chatId);
  }
  if (data.startsWith("cal")) {
    // получим id чата
    let chat_id = chatId;

    // получим callBackQuery_id
    let cbq_id = msg.callback_query_id;
    // получим переданное значение в кнопке
    let c_data = msg.data;
    // спарсим значения
    let params = c_data.split("_");
    // если это переключение между месяцами
    if (params[0] === "cal") {
      // выведем календарь на экран по переданным параметрам
      viewCal(params[1], params[2], chat_id, cbq_id, msg.message.message_id);
    }
    // если это нажатие по кнопке для информации
    else if (params[0] === "info") {
      // выведем информацию
      notice(cbq_id, params[1]);
    } else {
      // заглушим просто запрос
      notice(cbq_id, "This is notice for bot");
    }
  }

  if (data.startsWith("grade-")) {
    formSoloImg.grade = data.slice(6);
    console.log(formSoloImg);

    let idLesson = await drawSolo(
      formSoloImg.name,
      formSoloImg.grade,
      formSoloImg.technologies,
      formSoloImg.date,
      formSoloImg.teacher,
      formSoloImg.themes
    );

    let user = await User.updateOne(
      { idGroup: formSoloImg.idGroup },
      {
        $push: {
          events: {
            id: idLesson,
            date: formSoloImg.date,
            title: "Індивідуальний урок",
            grade: formSoloImg.grade,
            technologies: formSoloImg.technologies,
            themes: formSoloImg.themes,
            results: [
              {
                photo: "",
                url: "",
                description: "",
              },
            ],
          },
        },
      }
    );
    let user2 = await User.findOne({ idGroup: "-1001737433387" });

    // console.log(user);
    // console.log(user2);
    let ready = "";

    for (let i = 0; i < formSoloImg.themes.length; i++) {
      try {
        ready += `\n<b><u>▪️ ${formSoloImg.themes[
          i
        ].details.title.toUpperCase()}</u></b>`;
        } catch (e) {
          
        }

    }

    let template = `
<b>🎉 ВІТАЮ! УРОК ПРОЙДЕНО!</b>

За цей урок ти отримуєш: <b>${formSoloImg.grade * 20} 💎</b>

Теми, які пройшли на занятті:

${ready}

📚  Код з урока
📚  Додаткові матетіали
📚  Домашнє завдання


<b>ОЦІНКА:</b>
За заняття: ${formSoloImg.grade} БАЛІВ 
За домашнє завдання: 10  БАЛІВ 


ID заняття: 
<code>${idLesson}</code>

<i>Дізнатись детальніше про теми які вивчили на уроці, та отримати завдання по ним ви можете, обравши кнопку нижче 👇</i>

`;

    let formatPhoto = [];

    if (formSoloImg.photos.length >= 1) {
      formSoloImg.photos.forEach((photo) => {
        formatPhoto.push({
          type: "photo",
          media: photo,
          caption: `☝️ Декілька фотографій, на яких зображені результати нашої роботи та код який ми вивчаємо👨‍🎓`,
        });
      });

      await bot.sendMediaGroup(formSoloImg.idGroup, formatPhoto);
    }

    console.log("----");
    console.log(formSoloImg.themes);
    console.log("----");

    let resThemesBtns = [];
    formSoloImg.themes.forEach((theme) => {
try {
        resThemesBtns.push([
          {
            text: theme.details.title,
            callback_data: "soloTheme-" + theme.details.title,
          },
        ]);
      } catch (e) {}
    });
    let currentThemesKeyboard = {
      reply_markup: {
        inline_keyboard: resThemesBtns,
      },
    };

    addUserMoney(formSoloImg.idGroup, formSoloImg.grade * 20);

    await bot.sendPhoto(
      formSoloImg.idGroup,
      "./img/template-grade-individual-lesson20.png",
      { caption: template, parse_mode: "HTML", ...currentThemesKeyboard }
    );

    bot.sendMessage(
      chatId,
      "Запис про заняття збережений та відправлений учню"
    );
  }

  if (data.startsWith("learn-new-")) {
    let themeText = data.slice(10);
    let theme;
    for (let i = 0; i < themes[0].data.length; i++) {
      if (themes[0].data[i].details.title === themeText) {
        theme = themes[0].data[i].details;
      }
    }
    let sandbox = "";
    theme.default.sandbox.forEach((item) => {
      sandbox += `<a href="${item.url}">👉 ${item.title}</a>\n`;
    });
    let links = "";
    theme.links.forEach((item) => {
      links += `<a href="${item.url}">📑 ${item.title}</a>\n`;
    });
    let template1 = `
<b>Детальна інформація про команду: ${theme.title}</b>
⚡️ Скорочення: ${theme.speedCode} 

${theme.description}


<b>🧑‍💻 Приклад коду:</b>
<code>${theme.default.code[0].body}</code>

<b>🧑‍💻 Можеш переглянути приклади коду:</b>
${sandbox}

<b>🧑‍💻 Корисні посилання для закріплення теми:</b>
${links}

<b>Схожі команди, які скоро маємо вивчити:</b>
${theme.similarTags}

📆 День, коли ти вивчив цю команду: 26.05.2023

`;
    let keyboardThemeTasks = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Теоретичні питання (${theme.tests.length} шт.)`,
              callback_data: "task-teori-" + theme.title,
            },
          ],
          [
            {
              text: `Практичні завдання (${theme.tests.length} шт.)`,
              callback_data: "task-practice-" + theme.title,
            },
          ],
          [
            {
              text: `Домашнє завдання (${theme.tests.length} шт.)`,
              callback_data: "task-homework-" + theme.title,
            },
          ],
        ],
      },
    };

    let template2 = `
<b>Оцінки по темі ${theme.title}</b>
▪ За урок: 11б.
▪ Домашнє завдання: <b>--</b>
▪ Практичні завдання: <b>--</b>
▪ Теорія: <b>--</b>

▪ 1 Екзамен: <b>--</b>
<i>Заплановано на 26.07.2023</i>

▪ 2 Екзамен: <b>--</b>
<i>Заплановано на 26.09.2023</i>


    `;
    await bot.sendPhoto(chatId, theme.default.images[0].url, {
      caption: template1,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    await bot.sendMessage(chatId, template2, {
      ...keyboardThemeTasks,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  }

  if (data.startsWith("help-50/50-")) {
    let id = data.slice(11); // ec31bbe0
    try {
      bot.editMessageReplyMarkup(
        keyboards.editTest50(msg.message.reply_markup, msg.data, bot, chatId),
        {
          message_id: msg.message.message_id,
          chat_id: chatId,
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  if (data.startsWith("help-video-")) {
    let id = data.slice(11); // ec31bbe0
    bot.sendMessage(
      chatId,
      "Ось відео по цій темі 👇 \n<i>Потрібно трішки зачекати, відео завантажується...<i>",
      { parse_mode: "HTML" }
    );
  }

  if (data.startsWith("help-article-")) {
    let id = data.slice(13); // ec31bbe0
    console.log(msg);
    bot.sendMessage(chatId, "hello");
  }

  if (data.startsWith("info")) {
    formSoloImg.date = data.slice(5);
    formSoloImg.technologies = [];
    bot.sendMessage(
      chatId,
      `Дата: ` + data.slice(5) + ` обрана.`,
      keyboards.confirmTechnology
    );
    bot.sendMessage(
      chatId,
      `Оберіть технології з якими працювали на уроці`,
      keyboards.technologiesKeyboard()
    );

    let msg = await bot.sendMessage(
      chatId,
      JSON.stringify(formSoloImg.technologies)
    );

    idMsgTechnologies = msg.message_id;
  }
});

bot.on("poll_answer", async (msg) => {
  console.log(msg.poll_id);
});

bot.on("web_app_data", async (msg) => {
  let chatId = msg.chat.id;
  console.log(msg);
  bot.sendMessage(chatId, msg.web_app_data.button_text);
  bot.sendMessage(chatId, msg.web_app_data.data);
});

bot.on("photo", async (msg) => {
  let photo = msg.photo[msg.photo.length - 1].file_id;
  let pathToImg = await bot.downloadFile(photo, "./img/students/solo");
  formSoloImg.photos.push("./" + pathToImg);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export {
  testsID,
  shuffle,
  getNamesStudentByIdGroup,
  getNamesOneStudentByIdGroup,
};
