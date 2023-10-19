import { JSDOM } from "jsdom";
import Color from "color";

function colorToRGB(colorName) {
  return Color(colorName).rgb().string();
}

let flag = 0;

const translations = {
  a: "посилання",
  abbr: "скорочення або акронім",
  address: "блок з контактною інформацією автора",
  article: "самостійний розділ вмісту",
  aside: "блок відокремленого від основного вмісту контенту",
  audio: "елемент для відтворення аудіофайлів",
  blockquote: "велика цитата",
  body: "весь сайт",
  br: "перенос рядка (ентер)",
  button: "кнопка",
  canvas: "елемент для графічного відображення",
  caption: "заголовок таблиці",
  cite: "посилання на джерело цитування",
  code: "блок з кодом",
  dd: "опис елемента <dt> в описовому списку",
  del: "текст, який було видалено (перекреслений текст)",
  details: "віджет з додатковою інформацією, яка за замовчуванням прихована",
  dialog: "діалогове вікно",
  div: "прямокутник",
  dl: "описовий список",
  dt: "термін в описовому списку",
  footer: "нижня частина сайту",
  form: "форма для введення даних",
  h1: "заголовок першого рівня",
  h2: "заголовок другого рівня",
  h3: "заголовок третього рівня",
  h4: "заголовок четвертого рівня",
  h5: "заголовок п'ятого рівня",
  h6: "заголовок шостого рівня",
  head: "контейнер для мета-елементів документа",
  header: "верхня частина сайту",
  hr: "горизонтальна лінія",
  html: "кореневий елемент документа",
  i: "нахилений текст",
  iframe: "вбудований документ у вигляді фрейму",
  img: "графічне зображення",
  input: "елемент введення даних у формі",
  label: "мітка для елемента форми",
  li: "елемент списку",
  link: "посилання на зовнішні ресурси для документа",
  main: "основний вміст документа",
  menu: "список команд/посилань",
  meta: "мета-інформація документа",
  meter: "індикатор значення в межах відомого діапазону",
  nav: "розділ з навігаційними посиланнями",
  ol: "нумерований список",
  option: "елемент випадаючого списку <select>",
  output: "результат обчислення або дії користувача у формі",
  p: "абзац тексту",
  pre: "текст з представленням в форматі, як його написано",
  progress: "індикатор процесу",
  q: "коротке цитування",
  s: "перекреслений текст",
  script: "код скрипта",
  select: "випадаючий список",
  source: "джерело медіа для елементів <audio> та <video>",
  span: "блок для групування чи стилізації тексту",
  strong: "текст з підвищеною важливістю",
  style: "стилі для документа",
  sub: "нижній індекс",
  sup: "верхній індекс",
  summary: "заголовок для елемента <details>",
  table: "таблиця",
  tbody: "тіло таблиці",
  td: "клітинка таблиці",
  template: "шаблон контенту для подальшого використання",
  textarea: "багаторядкове поле для введення тексту",
  tfoot: "нижній колонтитул таблиці",
  th: "заголовок клітинки таблиці",
  thead: "верхній колонтитул таблиці",
  time: "час або дата/час",
  title: "заголовок документа",
  tr: "рядок таблиці",
  u: "підкреслений текст",
  ul: "ненумерований список",
  video: "елемент для відтворення відеофайлів",
  wbr: "підказка для переносу рядка в тексті",
  width: "ширину",
  height: "висоту",
  border: "рамку",
  background: "фон",
  color: "колір тексту",
  margin: "відступ",
  padding: "внутрішні відступи",
  h1: "найбільший текст",
  h2: "заголовок другого рівня",
  h3: "заголовок третього рівня",
  h4: "заголовок четвертого рівня",
  h5: "заголовок пятого рівня",
  h6: "найменший текст",
  "padding-left": "внутрішній відступ зліва",
  "font-size": "розмір тексту",
  "padding-right": "внутрішній відступ справа",
  "padding-top": "внутрішню відступ зверху",
  "padding-bottom": "внутрішню відступ знизу",
  "margin-left": "зовнішній відступ зліва",
  "margin-right": "зовнішній відступ справа",
  "margin-top": "зовнішню відступ зверху",
  "margin-bottom": "зовнішню відступ знизу",
  "border-radius": "закруглення рамки",
  textarea: "великий інпут",
  font: "шрифт",
  "font-weight": "жирність шрифта",
  "font-style": "стиль шрифта",
  "text-decoration": "оформлення тексту",
  "text-align": "вирівнювання тексту",
  float: "обтікання",
  clear: "очищення",
  position: "позиціонування",
  top: "верх",
  right: "право",
  bottom: "низ",
  left: "ліво",
  href: 'посилання, яке має вести на сайт:',
  "z-index": "індекс шару",
  div: "прямокутник",
  img: "зображення",
  b: "жирний текст",
  s: "перекреслений текст",
  i: "нахилений текст",
  u: "підкреслений текст",
  p: "звичайний текст",
  button: "кнопку",
};

function generatePracticeTask(task) {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    type: task.type,
    level: task.level,
    themes: ["html"],
    codeResult: {
      html: task.codeResult.html,
      css: task.codeResult.css,
      js: task.codeResult.js,
    },
    tasks: [
      ...convertArray(parseHTML(task.codeResult.html), task),
      ...generateTasks(task.codeResult.css, task.codeResult.html, task),
    ],
    data: task.data,
  };
}

function parseHTML(html) {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const { Node } = dom.window;

  function parseNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent.trim();
      if (textContent === "") {
        return null;
      }
      return {
        type: "text",
        text: textContent,
      };
    }

    return {
      tagName: node.tagName.toLowerCase(),
      attributes: Array.from(node.attributes).map((attr) => ({
        attribute: attr.name,
        value: attr.value,
      })),
      children: Array.from(node.childNodes)
        .map(parseNode)
        .filter((child) => child !== null),
    };
  }

  return [parseNode(document.body.firstChild)];
}

function convertArray(inputArray, task, parentSelector = "", parentLabel = "") {
  const resultArray = {};
  const childSelectorCounters = {};

function processElement(
  element,
  parentSelector = "",
  parentLabel = "",
  selectorNumber = 1
) {


  if (element.type === "text" && element.text) {
    flag = 1;
    const textCheck = [
      {
        type: "textElement",
        selector: parentSelector,
        selectorNumber,
        text: element.text,
      },
    ];

    resultArray[parentSelector + ":text"] = {
      title: `Додай текст: "${element.text}" у ${parentLabel}`,
      label: element.text,
      description: `Додай текст: "${element.text}" у ${parentLabel}`,
      check: textCheck,
    };
  } else {
    flag = 0;
  }


  if (element.tagName) {
    const translatedTag = translations[element.tagName] || element.tagName;
    const selector = parentSelector
      ? `${parentSelector} > ${element.tagName}`
      : element.tagName;

    if (!childSelectorCounters[selector]) {
      childSelectorCounters[selector] = 1;
    } 
    else {
      childSelectorCounters[selector]++;
    }

    const currentSelector = `${selector}:nth-child(${selectorNumber})`;

    const check = [
      {
        type: "htmlElement",
        selector: currentSelector,
        selectorNumber,
        amount: 1,
      },
    ];

    const currentParentLabel = parentSelector ? ` у ${parentLabel}` : "";

    resultArray[currentSelector] = {
      title: `Створи ${translatedTag}${currentParentLabel}`,
      label: "",
      description: `Створи ${translatedTag}${currentParentLabel}`,
      check,
    };

   if (element.attributes && element.attributes.length > 0) {
     element.attributes.forEach((attr) => {
       const attrCheck = [
         {
           type: "attributeElement",
           selector: currentSelector,
           selectorNumber,
           attributeName: attr.attribute,
           attributeValue: attr.value,
         },
       ];

       resultArray[currentSelector + attr.attribute] = {
         title: `Додай атрибут ${attr.attribute} для ${translatedTag}${currentParentLabel}`,
         label: attr.value,
         description: `Додай атрибут ${attr.attribute} для ${translatedTag}${currentParentLabel}`,
         check: attrCheck,
       };
     });
   }

    if (element.children && element.children.length > 0) {
      element.children.forEach((child, index) => {
        processElement(
          child,
          currentSelector,
          `${translatedTag}${currentParentLabel}`,
          index + 1
        );
      });
    }
  }
}

  if (inputArray && inputArray.length > 0) {
    inputArray.forEach((element, index) => {
      processElement(element, "", "", index + 1);
    });
  }

  return Object.values(resultArray);
}

function logObject(obj, indent = "") {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === "object") {
        logObject(value, `${indent}\t`);
      } else {
        console.log(`${indent}${key}: ${value}`);
      }
    }
  }
}

function generateTasks(cssCode, htmlCode, task) {
  const tasks = [];
  const lines = cssCode.split("\n");
  let currentSelector = "";
  let isHover = false;

  const colorProperties = ["color", "background", "border", "border-color"];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("//")) {
      continue;
    } else if (line.endsWith("{")) {
      currentSelector = line.substring(0, line.length - 1).trim();
      isHover = currentSelector.endsWith(":hover");
      if (isHover) {
        currentSelector = currentSelector
          .substring(0, currentSelector.length - 6)
          .trim();
      }
    } else if (line.endsWith("}")) {
      currentSelector = "";
      isHover = false;
    }

    if (line.includes(":")) {
      const [property, value] = line.split(":").map((item) => item.trim());

      const translatedProperty = translations[property] || property;
      const elementType = currentSelector.startsWith(".")
        ? "елемента з класом"
        : "елемента";

      const hoverText = isHover ? "при наведенні мишкою " : "";
      const title = `Додай для ${elementType} ${currentSelector} ${hoverText}${
        translations[property] || translatedProperty
      }`;

      const selector = currentSelector;

      const sanitizedValue = value.replace(/;/g, ""); // Удаляем символ ";"

      let rgbValue = sanitizedValue;

      // Проверяем, является ли свойство цветом
      if (colorProperties.includes(property)) {
        try {
          let colorValue = sanitizedValue;

          // Если свойство является border, нужно извлечь цвет из значения
          if (property === "border") {
            const borderValues = sanitizedValue.split(" ");
            if (borderValues.length === 3) {
              colorValue = borderValues[2];
            }
          }

          rgbValue = rgbValue.replace(colorValue, colorToRGB(colorValue)); // Преобразуем значение в RGB
        } catch (error) {
          console.error(
            `Не удалось преобразовать значение в RGB: ${sanitizedValue}`
          );
        }
      }

      tasks.push({
        title,
        label: sanitizedValue,
        description: `Додай для ${elementType} ${currentSelector} ${
          translations[property] || translatedProperty
        }`,
        check: [
          {
            type: isHover ? "cssHoverValue" : "cssValue",
            selector,
            selectorNumber: tasks.length,
            commandCSS: property,
            command: property.replace(/-([a-z])/g, (match, letter) =>
              letter.toUpperCase()
            ),
            value: rgbValue,
            valueCSS: value,
          },
        ],
      });
    }
  }

  return tasks;
}


let result = generatePracticeTask({
  id: "__1",
  name: "Картка товару ",
  description: "(мікрофон)",
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
});

logObject(result);
export default generatePracticeTask;
