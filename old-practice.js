
  {
    id: 22,
    name: "Текст по центру та з наведенням миші",
    description: "Текст по центру та з наведенням миші",
    type: "",
    level: 1,
    themes: ["html", "css"],
    tasks: [
      {
        title: "Створи прямокутник",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "div",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай клас прямокутнику",
        label: "block",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "div",
            selectorNumber: 0,
            className: "block",
          },
        ],
      },

      {
        title: "Створи зображення",
        label: "в прямокутнику з класом block",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "div>img",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Посилання на зображення",
        label: "https://bot.dimanice.repl.co/book.png",
        description: "",
        check: [
          {
            type: "attrHTMLElement",
            selector: "div>img",
            selectorNumber: 0,
            attr: "src",
            attrValue: "https://bot.dimanice.repl.co/book.png",
          },
        ],
      },

      {
        title: "Опис зображення",
        label: "photo",
        description: "",
        check: [
          {
            type: "attrHTMLElement",
            selector: "div>img",
            selectorNumber: 0,
            attr: "alt",
            attrValue: "photo",
          },
        ],
      },

      {
        title: "Створи прямокутник",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "div>div",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай клас прямокутнику",
        label: "happy",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "div>div",
            selectorNumber: 0,
            className: "happy",
          },
        ],
      },

      {
        title: "Створи жирний текст",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "div>div>b",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай йому текст",
        label: "element",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "div>div>b",
            selectorNumber: 0,
            text: "element",
          },
        ],
      },
      {
        title: "Додай клас жирному тексту",
        label: "bold",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "div>div>b",
            selectorNumber: 0,
            className: "bold",
          },
        ],
      },
      {
        title: "Створи кнопку",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "div>div>b",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай їй текст",
        label: "click me",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "div>button",
            selectorNumber: 0,
            text: "click me",
          },
        ],
      },
      {
        title: "Додай клас для кнопки",
        label: "click_me",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "div>button",
            selectorNumber: 0,
            className: "click_me",
          },
        ],
      },
    ],
    data: {
      html: ``,

      css: ``,
      js: ``,
    },
  },

  {
    id: 20,
    name: "Текст по центру та з наведенням миші",
    description: "Текст по центру та з наведенням миші",
    type: "",
    level: 1,
    themes: ["html", "css"],
    tasks: [
      {
        title: "Створи звичайний текст",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "p",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай йому текст",
        label:
          "Наприкінці лютого ми живемо в очікуванні теплої весни. Набридливий мокрий сніг вже розтанув. Тривалість світлового дня збільшується. Лагідне сонечко світить все яскравіше. Тепер воно починає поступово прогрівати холодну землю. Де-не-де зʼявляються тендітні квіти — проліски. Вони є провісниками довгоочікуваної весни.",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "p",
            selectorNumber: 0,
            text: "Наприкінці лютого ми живемо в очікуванні теплої весни. Набридливий мокрий сніг вже розтанув. Тривалість світлового дня збільшується. Лагідне сонечко світить все яскравіше. Тепер воно починає поступово прогрівати холодну землю. Де-не-де зʼявляються тендітні квіти — проліски. Вони є провісниками довгоочікуваної весни.",
          },
        ],
      },
      {
        title: "Додай клас для текста",
        label: "text",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "p",
            selectorNumber: 0,
            className: "text",
          },
        ],
      },
      {
        title: "Додай клас для текста",
        label: "text1",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "p",
            selectorNumber: 0,
            className: "text1",
          },
        ],
      },


img {
  width: 200px;
}
.block {
  background: skyblue;
  padding-left: 30px;
  border-radius: 30px;
}
.block:hover {
  border-radius: 30px;
}


     [
      {
        title: "Додай для зобаження ширину",
        label: "200 пікселів",
        description:"",
        check: [
          {
            type: "cssValue",
            selector: "img",
            selectorNumber: 0,
            commandCSS: "width",
            command: "width",
            value: "300px",
            valueCSS: "300px",
          },
        ],
      },
    
       {
        title: "Додай для елемента з класом block фон",
        label: "синій",
        description:"",
        check: [
          {
            type: "cssValue",
            selector: ".block",
            selectorNumber: 0,
            commandCSS: "background",
            command: "background",
            value: "blue",
            valueCSS: "blue",
          },
        ],
      },

      {
        title: "Додай для елемента з класом block внутрішню відстань зліва",
        label: "30 пікселів",
        description:"",
        check: [
          {
            type: "cssValue",
            selector: ".block",
            selectorNumber: 0,
            commandCSS: "padding-left",
            command: "paddingLeft",
            value: "30px",
            valueCSS: "30px",
          },
        ],
      },
        {
        title: "Додай для елемента з класом block заокруглення",
        label: "30 пікселів",
        description:"",
        check: [
          {
            type: "cssValue",
            selector: ".block",
            selectorNumber: 0,
            commandCSS: "border-radius",
            command: "borderRadius",
            value: "30px",
            valueCSS: "30px",
          },
        ],
      },
         {
        title: "Додай для елемента з класом block при наведені мишкою заокруглення",
        label: "50 пікселів",
        description:"",
        check: [
          {
            type: "cssHoverValue",
            selector: ".block",
            selectorNumber: 0,
            commandCSS: "border-radius",
            command: "borderRadius",
            value: "30px",
            valueCSS: "30px",
          },
        ],
      },

    ]




      {
        title: "Зроби текст",
        label: "по центру",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "text-align",
            command: "textAlign",
            value: "center",
            valueCSS: "center",
          },
        ],
      },
      {
        title: "Зроби жирність тексту",
        label: "300",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "font-weight",
            command: "fontWeight",
            value: "300",
            valueCSS: "300",
          },
        ],
      },
      {
        title: "При наведені мишкою зміни колір тексту на",
        label: "синій",
        description: "Cиній на англійській мові - blue",
        check: [
          {
            type: "cssHoverValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "color",
            command: "color",
            value: getCodeColor("blue", "rgb"),
            valueCSS: "blue",
          },
        ],
      },
    ],
    data: {
      html: ``,

      css: ``,
      js: ``,
    },
  },

  {
    id: 2,
    name: "Текст по центру та з наведенням миші",
    description: "Текст по центру та з наведенням миші",
    type: "",
    level: 1,
    themes: ["html", "css"],
    tasks: [
      {
        title: "Створи звичайний текст",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "p",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай йому текст",
        label:
          "Наприкінці лютого ми живемо в очікуванні теплої весни. Набридливий мокрий сніг вже розтанув. Тривалість світлового дня збільшується. Лагідне сонечко світить все яскравіше. Тепер воно починає поступово прогрівати холодну землю. Де-не-де зʼявляються тендітні квіти — проліски. Вони є провісниками довгоочікуваної весни.",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "p",
            selectorNumber: 0,
            text: "Наприкінці лютого ми живемо в очікуванні теплої весни. Набридливий мокрий сніг вже розтанув. Тривалість світлового дня збільшується. Лагідне сонечко світить все яскравіше. Тепер воно починає поступово прогрівати холодну землю. Де-не-де зʼявляються тендітні квіти — проліски. Вони є провісниками довгоочікуваної весни.",
          },
        ],
      },
      {
        title: "Додай клас для текста",
        label: "text",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "p",
            selectorNumber: 0,
            className: "text",
          },
        ],
      },
      {
        title: "Додай клас для текста",
        label: "text1",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "p",
            selectorNumber: 0,
            className: "text1",
          },
        ],
      },
      {
        title: "Додай для текста колір тексту",
        label: getCodeColor("green", "ua"),
        description:
          getCodeColor("green", "ua") + " на англійській мові - green",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "color",
            command: "color",
            value: getCodeColor("green", "rgb"),
            valueCSS: "green",
          },
        ],
      },
      {
        title: "Розмір тексту має бути",
        label: "24 пікселя",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "font-size",
            command: "fontSize",
            value: "24px",
            valueCSS: "24px",
          },
        ],
      },

      {
        title: "Додай ширину",
        label: "400 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "width",
            command: "width",
            value: "400px",
            valueCSS: "400px",
          },
        ],
      },
      {
        title: "Додай відстань зліва",
        label: "150 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "margin-left",
            command: "marginLeft",
            value: "150px",
            valueCSS: "150px",
          },
        ],
      },
      {
        title: "Додай відстань зверху",
        label: "40 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "margin-top",
            command: "marginTop",
            value: "40px",
            valueCSS: "40px",
          },
        ],
      },
      {
        title: "Зроби текст",
        label: "по центру",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "text-align",
            command: "textAlign",
            value: "center",
            valueCSS: "center",
          },
        ],
      },
      {
        title: "Зроби жирність тексту",
        label: "300",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "font-weight",
            command: "fontWeight",
            value: "300",
            valueCSS: "300",
          },
        ],
      },
      {
        title: "При наведені мишкою зміни колір тексту на",
        label: "синій",
        description: "Cиній на англійській мові - blue",
        check: [
          {
            type: "cssHoverValue",
            selector: "p",
            selectorNumber: 0,
            commandCSS: "color",
            command: "color",
            value: getCodeColor("blue", "rgb"),
            valueCSS: "blue",
          },
        ],
      },
    ],
    data: {
      html: ``,

      css: ``,
      js: ``,
    },
  },

  {
    id: 1,
    name: "Створи гарну кнопку",
    description: "Створи кнопку купити",
    type: "",
    level: 1,
    themes: ["html", "css"],
    tasks: [
      {
        title: "Створи змінну",
        label: "colors",
        description: "",
        check: [
          {
            type: "jsIsVariable",
            selector: "colors",
          },
        ],
      },

      {
        title: "Змінна colors має бути",
        label: "списком",
        description: "",
        check: [
          {
            type: "jsVariableType",
            selector: "colors",
            typeOF: "array",
          },
        ],
      },
      {
        title: "Створи змінну",
        label: "user",
        description: "",
        check: [
          {
            type: "jsIsVariable",
            selector: "user",
          },
        ],
      },
      {
        title: "Змінна user має бути",
        label: "об'єктом",
        description: "",
        check: [
          {
            type: "jsVariableType",
            selector: "user",
            typeOF: "object",
          },
        ],
      },
      {
        title: "Створи змінну",
        label: "info",
        description: "",
        check: [
          {
            type: "jsIsVariable",
            selector: "info",
          },
        ],
      },
      {
        title: "В змінну info поклади текст",
        label: "програміст",
        description: "",
        check: [
          {
            type: "jsVariableType",
            selector: "info",
            typeOF: "string",
          },
        ],
      },
      {
        title: "В змінну colors поклади будь-яких",
        label: "2 кольори",
        description: "",
        check: [
          {
            type: "jsVariableLength",
            selector: "colors",
            length: 2,
          },
          {
            type: "jsArrayType",
            selector: "colors",
            isAll: true,
            typeOF: "",
          },
        ],
      },
      {
        title: "Створи кнопку",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "button",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай текст для кнопки",
        label: "Замовити доставку",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "button",
            selectorNumber: 0,
            text: "замовити доставку",
          },
        ],
      },
      {
        title: "Додай клас для кнопки",
        label: "button1",
        description: "",
        check: [
          {
            type: "classElement",
            selector: "button",
            selectorNumber: 0,
            className: "button1",
          },
        ],
      },
      {
        title: "Додай для кнопки колір фону",
        label: getCodeColor("black", "ua"),
        description:
          getCodeColor("black", "ua") + " на англійській мові - black",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "background-color",
            command: "backgroundColor",
            value: getCodeColor("black", "rgb"),
            valueCSS: "black",
          },
        ],
      },
      {
        title: "Шрифт текста на кнопкі має бути",
        label: "Inter",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "font-family",
            command: "fontFamily",
            value: "Inter",
            valueCSS: "Inter",
          },
        ],
      },
      {
        title: "Додай для кнопки колір тексту",
        label: "білий",
        description: "Білий на англійській мові - white",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "color",
            command: "color",
            value: "rgb(255, 255, 255)",
            valueCSS: "white",
          },
        ],
      },
      {
        title: "Видали рамку",
        label: "",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "border",
            command: "border",
            value: "0px none rgb(255, 255, 255)",
            valueCSS: "0",
          },
        ],
      },
      {
        title: "Додай ширину",
        label: "160 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "width",
            command: "width",
            value: "160px",
            valueCSS: "160px",
          },
        ],
      },
      {
        title: "Додай висоту",
        label: "40 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "height",
            command: "height",
            value: "40px",
            valueCSS: "40px",
          },
        ],
      },
      {
        title: "Додай заокруглення",
        label: "30 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "border-radius",
            command: "borderRadius",
            value: "30px",
            valueCSS: "30px",
          },
        ],
      },
      {
        title: "При наведені мишкою зміни фон на",
        label: "Темно-синій",
        description: "Темно-синій на англійській мові - darkblue",
        check: [
          {
            type: "cssHoverValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "background-color",
            command: "backgroundColor",
            value: getCodeColor("darkblue", "rgb"),
            valueCSS: "darkblue",
          },
        ],
      },
    ],
    data: {
      html: ``,

      css: ``,
      js: ``,
    },
  },
  {
    id: 5,
    name: "Створи гарну кнопку",
    description: "Створи кнопку купити",
    type: "",
    level: 1,
    themes: ["html"],
    tasks: [
      {
        title: "Створи кнопку",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "button",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай текст для кнопки",
        label: "купити",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "button",
            selectorNumber: 0,
            text: "купити",
          },
        ],
      },
      {
        title: "Додай для кнопки колір фону",
        label: "синій",
        description: "Синій на англійській мові - blue",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "background-color",
            command: "backgroundColor",
            value: "rgb(0, 0, 255)",
            valueCSS: "blue",
          },
        ],
      },
      {
        title: "Додай для кнопки колір тексту",
        label: "білий",
        description: "Білий на англійській мові - white",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "color",
            command: "color",
            value: "rgb(255, 255, 255)",
            valueCSS: "white",
          },
        ],
      },
      {
        title: "Видали рамку",
        label: "",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "border",
            command: "border",
            value: "0px none rgb(255, 255, 255)",
            valueCSS: "0",
          },
        ],
      },
      {
        title: "Додай ширину",
        label: "100 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "width",
            command: "width",
            value: "100px",
            valueCSS: "100px",
          },
        ],
      },
      {
        title: "Додай висоту",
        label: "30 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "button",
            selectorNumber: 0,
            commandCSS: "height",
            command: "height",
            value: "30px",
            valueCSS: "30px",
          },
        ],
      },
    ],
    data: {
      html: ``,

      css: ``,
      js: ``,
    },
  },

  {
    id: 10,
    name: "Фон та ширина прямокутника",
    description: "Прямокутнику дати червоний фон (red)",
    type: "",
    level: 1,
    themes: ["css"],
    tasks: [
      {
        title: "Додай прямокутнику фон",
        label: "червоний",
        description: "Червоний на англійській мові - red",
        check: [
          {
            type: "cssValue",
            selector: "div",
            selectorNumber: 0,
            commandCSS: "background-color",
            command: "backgroundColor",
            value: "rgb(255, 0, 0)",
            valueCSS: "red",
          },
        ],
      },
      {
        title: "Зроби ширину прямокутника",
        label: "300 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "div",
            selectorNumber: 0,
            commandCSS: "width",
            command: "width",
            value: "300px",
            valueCSS: "300px",
          },
        ],
      },
      {
        title: "Зроби висоту прямокутника",
        label: "150 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "div",
            selectorNumber: 0,
            commandCSS: "height",
            command: "height",
            value: "150px",
            valueCSS: "150px",
          },
        ],
      },
      {
        title: "Зроби заокруглення прямокутника",
        label: "30 пікселів",
        description: "",
        check: [
          {
            type: "cssValue",
            selector: "div",
            selectorNumber: 0,
            commandCSS: "border-radius",
            command: "borderRadius",
            value: "30px",
            valueCSS: "30px",
          },
        ],
      },
    ],
    data: {
      html: `
<div class="block"> <div>

        `,

      css: `.block {

}
        `,
      js: ``,
    },
  },

  {
    id: 2,
    name: "Колір тексту",
    description: "Додай найбільшому тексту зелений колір (green)",
    type: "",
    level: 1,
    themes: ["css", "html"],
    tasks: [
      {
        title: "Додай найбільшому тексту колір",
        label: "зелений",
        description: "Зелений на англійській мові - green",
        check: [
          {
            type: "cssValue",
            selector: ".h1",
            selectorNumber: 0,
            commandCSS: "color",
            command: "color",
            value: "rgb(0, 128, 0)",
            valueCSS: "green",
          },
        ],
      },
    ],
    data: {
      html: `<h1 class="h1">JavaScript</h1>`,

      css: `.h1 {

}
        `,
      js: ``,
    },
  },

  {
    id: 3,
    name: "Створи кнопку",
    description: "Створи кнопку купити",
    type: "",
    level: 1,
    themes: ["html"],
    tasks: [
      {
        title: "Створи кнопку",
        label: "",
        description: "",
        check: [
          {
            type: "htmlElement",
            selector: "button",
            selectorNumber: 0,
            amount: 1,
          },
        ],
      },
      {
        title: "Додай текст для кнопки",
        label: "купити",
        description: "",
        check: [
          {
            type: "textHTMLElement",
            selector: "button",
            selectorNumber: 0,
            text: "купити",
          },
        ],
      },
    ],
    data: {
      html: `<h1 class="h1">JavaScript</h1>`,

      css: `.h1 {

}
        `,
      js: ``,
    },
  },