let englishWords = [
  {
    english: "true",
    ukranian: "правда",
    russian: "истина",
    example: [
      {
        technology: "javascript",
        example: `
          const isTrue = true;
        `,
      },
      {
        technology: "python",
        example: `
          is_true = True
        `,
      },
    ],
  },
  {
    english: "false",
    ukranian: "неправда",
    russian: "ложь",
    example: [
      {
        technology: "javascript",
        example: `
          const isFalse = false;
        `,
      },
      {
        technology: "python",
        example: `
          is_false = False
        `,
      },
    ],
  },
  {
    english: "if",
    ukranian: "якщо",
    russian: "если",
    example: [
      {
        technology: "javascript",
        example: `
          if (5 > 3) {
            console.log("True");
          }
        `,
      },
      {
        technology: "python",
        example: `
          if 5 > 3:
            print("True")
        `,
      },
    ],
  },
  {
    english: "template",
    ukranian: "шаблон",
    russian: "шаблон",
    example: [
      {
        technology: "javascript",
        example: `
          const template = \`Hello, \${name}!\`;
        `,
      },
      {
        technology: "python",
        example: `
          from string import Template
          t = Template('Hello, $name!')
        `,
      },
    ],
  },
  {
    english: "flex",
    ukranian: "гнучкий",
    russian: "гибкий",
    example: [
      {
        technology: "css",
        example: `
          .container {
            display: flex;
          }
        `,
      },
    ],
  },
  {
    english: "grid",
    ukranian: "сітка",
    russian: "сетка",
    example: [
      {
        technology: "css",
        example: `
          .container {
            display: grid;
          }
        `,
      },
    ],
  },
  {
    english: "keyframe",
    ukranian: "ключовий кадр",
    russian: "ключевой кадр",
    example: [
      {
        technology: "css",
        example: `
          @keyframes slide {
            from {
              transform: translateX(0%);
            }
            to {
              transform: translateX(100%);
            }
          }
        `,
      },
    ],
  },
  {
    english: "includes",
    ukranian: "включає",
    russian: "включает",
    example: [
      {
        technology: "javascript",
        example: `
          const array = [1, 2, 3, 4];
          const result = array.includes(2); // true
        `,
      },
    ],
  },
  {
    english: "before",
    ukranian: "до",
    russian: "до",
    example: [
      {
        technology: "css",
        example: `
          .element::before {
            content: "before";
          }
        `,
      },
    ],
  },
  {
    english: "font",
    ukranian: "шрифт",
    russian: "шрифт",
    example: [
      {
        technology: "css",
        example: `
          p {
            font-size: 16px;
          }
        `,
      },
    ],
  },
  {
    english: "button",
    ukranian: "кнопка",
    russian: "кнопка",
    example: [
      {
        technology: "html",
        example: `
          <button>Click Me!</button>
        `,
      },
      {
        technology: "css",
        example: `
          button {
            background-color: blue;
          }
        `,
      },
    ],
  },
  {
    english: "head",
    ukranian: "голова",
    russian: "голова",
    example: [
      {
        technology: "html",
        example: `
          <head>
            <title>My Page</title>
          </head>
        `,
      },
    ],
  },
  {
    english: "width",
    ukranian: "ширина",
    russian: "ширина",
    example: [
      {
        technology: "css",
        example: `
          .box {
            width: 100px;
          }
        `,
      },
    ],
  },
  {
    english: "height",
    ukranian: "висота",
    russian: "высота",
    example: [
      {
        technology: "css",
        example: `
          .box {
            height: 100px;
          }
        `,
      },
    ],
  },
  {
    english: "border",
    ukranian: "рамка",
    russian: "рамка",
    example: [
      {
        technology: "css",
        example: `
          .box {
            border: 1px solid black;
          }
        `,
      },
    ],
  },
  {
    english: "blur",
    ukranian: "розмиття",
    russian: "размытие",
    example: [
      {
        technology: "css",
        example: `
          .image {
            filter: blur(5px);
          }
        `,
      },
    ],
  },
  {
    english: "length",
    ukranian: "довжина",
    russian: "длина",
    example: [
      {
        technology: "javascript",
        example: `
          const arr = [1, 2, 3];
          const len = arr.length;
        `,
      },
      {
        technology: "python",
        example: `
          arr = [1, 2, 3]
          len = len(arr)
        `,
      },
    ],
  },
  {
    english: "input",
    ukranian: "ввід",
    russian: "ввод",
    example: [
      {
        technology: "html",
        example: `
          <input type="text" name="username">
        `,
      },
    ],
  },
  {
    english: "body",
    ukranian: "тіло",
    russian: "тело",
    example: [
      {
        technology: "html",
        example: `
          <body>
            <p>Hello, World!</p>
          </body>
        `,
      },
    ],
  },
  {
    english: "link",
    ukranian: "посилання",
    russian: "ссылка",
    example: [
      {
        technology: "html",
        example: `
          <a href="https://www.example.com">Visit Example</a>
        `,
      },
    ],
  },
  {
    english: "degree",
    ukranian: "градус",
    russian: "градус",
    example: [
      {
        technology: "css",
        example: `
          .element {
            transform: rotate(30deg);
          }
        `,
      },
    ],
  },
  {
    english: "shadow",
    ukranian: "тінь",
    russian: "тень",
    example: [
      {
        technology: "css",
        example: `
          .element {
            box-shadow: 5px 5px 10px grey;
          }
        `,
      },
    ],
  },
  {
    english: "image",
    ukranian: "зображення",
    russian: "изображение",
    example: [
      {
        technology: "html",
        example: `
          <img src="image.jpg" alt="Example image">
        `,
      },
    ],
  },
  {
    english: "size",
    ukranian: "розмір",
    russian: "размер",
    example: [
      {
        technology: "css",
        example: `
          .element {
            font-size: 16px;
          }
        `,
      },
    ],
  },
  {
    english: "weight",
    ukranian: "вага",
    russian: "вес",
    example: [
      {
        technology: "css",
        example: `
          .element {
            font-weight: bold;
          }
        `,
      },
    ],
  },
  {
    english: "box",
    ukranian: "коробка",
    russian: "коробка",
    example: [
      {
        technology: "css",
        example: `
          .box {
            width: 100px;
            height: 100px;
            border: 1px solid black;
          }
        `,
      },
    ],
  },
  {
    english: "caption",
    ukranian: "підпис",
    russian: "подпись",
    example: [
      {
        technology: "html",
        example: `
          <figcaption>This is a caption</figcaption>
        `,
      },
    ],
  },
  {
    english: "event",
    ukranian: "подія",
    russian: "событие",
    example: [
      {
        technology: "javascript",
        example: `
          document.addEventListener('click', function() {
            console.log('Element clicked!');
          });
        `,
      },
    ],
  },
  {
    english: "inherit",
    ukranian: "успадковувати",
    russian: "наследовать",
    example: [
      {
        technology: "css",
        example: `
          .element {
            color: inherit;
          }
        `,
      },
    ],
  },
  {
    english: "main",
    ukranian: "головний",
    russian: "главный",
    example: [
      {
        technology: "html",
        example: `
          <main>
            <p>This is the main content of the document.</p>
          </main>
        `,
      },
    ],
  },
  {
    english: "side",
    ukranian: "сторона",
    russian: "сторона",
    example: [
      {
        technology: "css",
        example: `
          .element {
            border-left: 1px solid black;
          }
        `,
      },
    ],
  },
  {
    english: "number",
    ukranian: "число",
    russian: "число",
    example: [
      {
        technology: "javascript",
        example: `
          const num = 42;
        `,
      },
      {
        technology: "python",
        example: `
          num = 42
        `,
      },
    ],
  },
  {
    english: "article",
    ukranian: "стаття",
    russian: "статья",
    example: [
      {
        technology: "html",
        example: `
          <article>
            <h2>Title</h2>
            <p>Content</p>
          </article>
        `,
      },
    ],
  },
  {
    english: "select",
    ukranian: "вибрати",
    russian: "выбрать",
    example: [
      {
        technology: "html",
        example: `
          <select name="options">
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
        `,
      },
    ],
  },
  {
    english: "table",
    ukranian: "таблиця",
    russian: "таблица",
    example: [
      {
        technology: "html",
        example: `
          <table>
            <tr>
              <td>Row 1, Cell 1</td>
              <td>Row 1, Cell 2</td>
            </tr>
          </table>
        `,
      },
    ],
  },
  {
    english: "value",
    ukranian: "значення",
    russian: "значение",
    example: [
      {
        technology: "javascript",
        example: `
          const value = 'Hello, world!';
        `,
      },
      {
        technology: "python",
        example: `
          value = 'Hello, world!'
        `,
      },
    ],
  },
  {
    english: "rotate",
    ukranian: "обертати",
    russian: "вращать",
    example: [
      {
        technology: "css",
        example: `
          .element {
            transform: rotate(45deg);
          }
        `,
      },
    ],
  },
  {
    english: "contain",
    ukranian: "містити",
    russian: "содержать",
    example: [
      {
        technology: "css",
        example: `
          .element {
            background-size: contain;
          }
        `,
      },
    ],
  },
  {
    english: "clear",
    ukranian: "очистити",
    russian: "очистить",
    example: [
      {
        technology: "css",
        example: `
          .clearfix:after {
            content: "";
            display: table;
            clear: both;
          }
        `,
      },
    ],
  },
  {
    english: "zoom",
    ukranian: "збільшення",
    russian: "увеличение",
    example: [
      {
        technology: "css",
        example: `
          .element {
            zoom: 1.5;
          }
        `,
      },
    ],
  },
  {
    english: "opacity",
    ukranian: "непрозорість",
    russian: "непрозрачность",
    example: [
      {
        technology: "css",
        example: `
          .element {
            opacity: 0.5;
          }
        `,
      },
    ],
  },
  {
    english: "show",
    ukranian: "показати",
    russian: "показать",
    example: [
      {
        technology: "javascript",
        example: `
          document.getElementById("element").style.display = "block";
        `,
      },
    ],
  },
  {
    english: "hide",
    ukranian: "сховати",
    russian: "скрыть",
    example: [
      {
        technology: "javascript",
        example: `
          document.getElementById("element").style.display = "none";
        `,
      },
    ],
  },
  {
    english: "infinity",
    ukranian: "нескінченність",
    russian: "бесконечность",
    example: [
      {
        technology: "javascript",
        example: `
          const inf = Infinity;
        `,
      },
      {
        technology: "python",
        example: `
          inf = float('inf')
        `,
      },
    ],
  },
  {
    english: "remove",
    ukranian: "видалити",
    russian: "удалить",
    example: [
      {
        technology: "javascript",
        example: `
          document.getElementById("element").remove();
        `,
      },
    ],
  },
  {
    english: "append",
    ukranian: "додати",
    russian: "добавить",
    example: [
      {
        technology: "javascript",
        example: `
          const element = document.createElement("div");
          document.body.appendChild(element);
        `,
      },
    ],
  },
  {
    english: "write",
    ukranian: "записати",
    russian: "записать",
    example: [
      {
        technology: "javascript",
        example: `
          document.write("Hello, world!");
        `,
      },
      {
        technology: "python",
        example: `
          with open("file.txt", "w") as f:
            f.write("Hello, world!")
        `,
      },
    ],
  },
  {
    english: "read",
    ukranian: "читати",
    russian: "читать",
    example: [
      {
        technology: "javascript",
        example: `
          const text = fs.readFileSync("file.txt", "utf-8");
        `,
      },
      {
        technology: "python",
        example: `
          with open("file.txt", "r") as f:
            text = f.read()
        `,
      },
    ],
  },
  {
    english: "continue",
    ukranian: "продовжити",
    russian: "продолжить",
    example: [
      {
        technology: "javascript",
        example: `
          for (let i = 0; i < 10; i++) {
            if (i === 5) {
              continue;
            }
            console.log(i);
          }
        `,
      },
      {
        technology: "python",
        example: `
          for i in range(10):
            if i == 5:
              continue
            print(i)
        `,
      },
    ],
  },
  {
    english: "break",
    ukranian: "зупинити",
    russian: "остановить",
    example: [
      {
        technology: "javascript",
        example: `
          for (let i = 0; i < 10; i++) {
            if (i === 5) {
              break;
            }
            console.log(i);
          }
        `,
      },
      {
        technology: "python",
        example: `
          for i in range(10):
            if i == 5:
              break
            print(i)
        `,
      },
    ],
  },
  {
    english: "return",
    ukranian: "повернути",
    russian: "вернуть",
    example: [
      {
        technology: "javascript",
        example: `
          function add(a, b) {
            return a + b;
          }
        `,
      },
      {
        technology: "python",
        example: `
          def add(a, b):
            return a + b
        `,
      },
      {
        technology: "java",
        example: `
          public int add(int a, int b) {
            return a + b;
          }
        `,
      },
      {
        technology: "c#",
        example: `
          public int Add(int a, int b) {
            return a + b;
          }
        `,
      },
    ],
  },
  {
    english: "math",
    ukranian: "математика",
    russian: "математика",
    example: [
      {
        technology: "javascript",
        example: `
          const squareRoot = Math.sqrt(9);
        `,
      },
      {
        technology: "python",
        example: `
          import math
          square_root = math.sqrt(9)
        `,
      },
    ],
  },
  {
    english: "parent",
    ukranian: "батько",
    russian: "родитель",
    example: [
      {
        technology: "javascript",
        example: `
          const parentElement = document.getElementById("parent");
          const childElement = parentElement.querySelector(".child");
        `,
      },
    ],
  },
  {
    english: "child",
    ukranian: "дитина",
    russian: "ребенок",
    example: [
      {
        technology: "javascript",
        example: `
          const parentElement = document.getElementById("parent");
          const childElement = parentElement.querySelector(".child");
        `,
      },
    ],
  },
  {
    english: "in",
    ukranian: "в",
    russian: "в",
    example: [
      {
        technology: "python",
        example: `
          for element in [1, 2, 3]:
            print(element)
        `,
      },
    ],
  },
  {
    english: "or",
    ukranian: "або",
    russian: "или",
    example: [
      {
        technology: "javascript",
        example: `
          if (a === 1 || b === 2) {
            console.log("True");
          }
        `,
      },
      {
        technology: "python",
        example: `
          if a == 1 or b == 2:
            print("True")
        `,
      },
    ],
  },
  {
    english: "and",
    ukranian: "та",
    russian: "и",
    example: [
      {
        technology: "javascript",
        example: `
          if (a === 1 && b === 2) {
            console.log("True");
          }
        `,
      },
      {
        technology: "python",
        example: `
          if a == 1 and b == 2:
            print("True")
        `,
      },
    ],
  },
  {
    english: "display",
    ukranian: "відобразити",
    russian: "отобразить",
    example: [
      {
        technology: "css",
        example: `
          .element {
            display: flex;
          }
        `,
      },
    ],
  },
  {
    english: "root",
    ukranian: "корінь",
    russian: "корень",
    example: [
      {
        technology: "css",
        example: `
          :root {
            --main-color: #333;
          }
        `,
      },
    ],
  },
  {
    english: "list",
    ukranian: "список",
    russian: "список",
    example: [
      {
        technology: "html",
        example: `
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        `,
      },
      {
        technology: "python",
        example: `
          my_list = [1, 2, 3]
        `,
      },
    ],
  },
  {
    english: "property",
    ukranian: "властивість",
    russian: "свойство",
    example: [
      {
        technology: "javascript",
        example: `
          const obj = { name: 'John' };
          console.log(obj.property);
        `,
      },
      {
        technology: "css",
        example: `
          .element {
            width: 100px;
          }
        `,
      },
    ],
  },
  {
    english: "value",
    ukranian: "значення",
    russian: "значение",
    example: [
      {
        technology: "javascript",
        example: `
          const a = 10;
        `,
      },
      {
        technology: "css",
        example: `
          .element {
            color: red;
          }
        `,
      },
    ],
  },
  {
    english: "rule",
    ukranian: "правило",
    russian: "правило",
    example: [
      {
        technology: "css",
        example: `
          @media (max-width: 600px) {
            .element {
              width: 100%;
            }
          }
        `,
      },
    ],
  },
  {
    english: "await",
    ukranian: "очікувати",
    russian: "ожидать",
    example: [
      {
        technology: "javascript",
        example: `
          async function fetchData() {
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            return data;
          }
        `,
      },
    ],
  },
  {
    english: "promise",
    ukranian: "обіцянка",
    russian: "обещание",
    example: [
      {
        technology: "javascript",
        example: `
          const myPromise = new Promise((resolve, reject) => {
            resolve('Success');
          });
        `,
      },
    ],
  },
  {
    english: "catch",
    ukranian: "ловити",
    russian: "ловить",
    example: [
      {
        technology: "javascript",
        example: `
          try {
            throw new Error('Something went wrong');
          } catch (error) {
            console.log(error);
          }
        `,
      },
      {
        technology: "python",
        example: `
          try:
            raise Exception("Something went wrong")
          except Exception as e:
            print(e)
        `,
      },
    ],
  },
  {
    english: "throw",
    ukranian: "кинути",
    russian: "бросить",
    example: [
      {
        technology: "javascript",
        example: `
          throw new Error('Something went wrong');
        `,
      },
    ],
  },
  {
    english: "try",
    ukranian: "спробувати",
    russian: "попробовать",
    example: [
      {
        technology: "javascript",
        example: `
          try {
            console.log(a);
          } catch (error) {
            console.log('An error occurred:', error);
          }
        `,
      },
      {
        technology: "python",
        example: `
          try:
            print(a)
          except Exception as e:
            print(f"An error occurred: {e}")
        `,
      },
    ],
  },
  {
    english: "slice",
    ukranian: "зріз",
    russian: "срез",
    example: [
      {
        technology: "javascript",
        example: `
          const arr = [1, 2, 3, 4];
          const slicedArr = arr.slice(1, 3);
        `,
      },
      {
        technology: "python",
        example: `
          arr = [1, 2, 3, 4]
          sliced_arr = arr[1:3]
        `,
      },
    ],
  },
  {
    english: "instance",
    ukranian: "екземпляр",
    russian: "экземпляр",
    example: [
      {
        technology: "python",
        example: `
          class MyClass:
            pass
          
          obj = MyClass()
        `,
      },
      {
        technology: "javascript",
        example: `
          class MyClass {}
          const obj = new MyClass();
        `,
      },
    ],
  },
  {
    english: "nested",
    ukranian: "вкладений",
    russian: "вложенный",
    example: [
      {
        technology: "javascript",
        example: `
          const obj = {
            name: 'John',
            details: {
              age: 30,
              address: '123 Main St'
            }
          };
        `,
      },
      {
        technology: "python",
        example: `
          obj = {
            'name': 'John',
            'details': {
              'age': 30,
              'address': '123 Main St'
            }
          }
        `,
      },
    ],
  },
  {
    english: "template",
    ukranian: "шаблон",
    russian: "шаблон",
    example: [],
  },
  {
    english: "flex",
    ukranian: "гнучкість",
    russian: "гибкость",
    example: [
      {
        technology: "css",
        example: `
          .container {
            display: flex;
          }
        `,
      },
    ],
  },
  {
    english: "grid",
    ukranian: "сітка",
    russian: "сетка",
    example: [
      {
        technology: "css",
        example: `
          .container {
            display: grid;
          }
        `,
      },
    ],
  },
  {
    english: "keyframe",
    ukranian: "ключовий кадр",
    russian: "ключевой кадр",
    example: [
      {
        technology: "css",
        example: `
          @keyframes slide {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(100px);
            }
          }
        `,
      },
    ],
  },
  {
    english: "includes",
    ukranian: "включає",
    russian: "включает",
    example: [
      {
        technology: "javascript",
        example: `
          const array = [1, 2, 3];
          const result = array.includes(2);
        `,
      },
      {
        technology: "python",
        example: `
          array = [1, 2, 3]
          result = 2 in array
        `,
      },
    ],
  },
  {
    english: "override",
    ukranian: "перевизначити",
    russian: "переопределить",
    example: [
      {
        technology: "java",
        example: `
        @Override
        public String toString() {
          return "Custom toString";
        }
      `,
      },
      {
        technology: "c#",
        example: `
        public override string ToString() {
          return "Custom toString";
        }
      `,
      },
    ],
  },
  {
    english: "query",
    ukranian: "запит",
    russian: "запрос",
    example: [
      {
        technology: "SQL",
        example: `
        SELECT * FROM users WHERE age > 21;
      `,
      },
      {
        technology: "javascript",
        example: `
        const query = 'age > 21';
        const result = users.filter(user => user.age > 21);
      `,
      },
    ],
  },
  {
    english: "dictionary",
    ukranian: "словник",
    russian: "словарь",
    example: [
      {
        technology: "python",
        example: `
        my_dict = {'key': 'value', 'age': 21}
      `,
      },
      {
        technology: "c#",
        example: `
        Dictionary<string, int> myDict = new Dictionary<string, int>();
        myDict.Add("age", 21);
      `,
      },
    ],
  },
  {
    english: "thread",
    ukranian: "потік",
    russian: "поток",
    example: [
      {
        technology: "java",
        example: `
        Thread thread = new Thread(() -> {
          System.out.println("New thread");
        });
        thread.start();
      `,
      },
      {
        technology: "c#",
        example: `
        Thread thread = new Thread(() => {
          Console.WriteLine("New thread");
        });
        thread.Start();
      `,
      },
    ],
  },
];

export { englishWords };
