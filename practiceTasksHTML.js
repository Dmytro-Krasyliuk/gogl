import { JSDOM } from "jsdom";



  // {
  //       title: "Створи зображення",
  //       label: "",
  //       description: "",
  //       check: [
  //         {
  //           type: "htmlElement",
  //           selector: "img",
  //           selectorNumber: 0,
  //           amount: 1,
  //         },
  //       ],
  //     },
  //     {
  //       title: "Посилання на зображення",
  //       label: "https://bot.dimanice.repl.co/book.png",
  //       description: "",
  //       check: [
  //         {
  //           type: "attrHTMLElement",
  //           selector: "img",
  //           selectorNumber: 0,
  //           attr: "src",
  //           attrValue: "https://bot.dimanice.repl.co/book.png",
  //         },
  //       ],
  //     },




function generatePracticeTaskHTML(practiceTask) {
  const dom = new JSDOM();
  let document = dom.window.document;

  practiceTask.tasks.forEach((task) => {
    task.check.forEach((taskItem) => {

      if (taskItem.type === "htmlElement") {
        console.log(taskItem);
        for (let i = 0; i < taskItem.amount; i++) {
          let el = document.createElement(taskItem.selector);
          document.body.appendChild(el);
        }
      }

       if (taskItem.type === "attrHTMLElement") {
         console.log(taskItem);
           document.querySelectorAll(taskItem.selector)[
             taskItem.selectorNumber
           ][taskItem.attr] = taskItem.attrValue;
           console.log(taskItem.attrValue)
       }


      if (taskItem.type === "textHTMLElement") {
          console.log(taskItem);
          let el = document.querySelectorAll(taskItem.selector)[
            taskItem.selectorNumber
          ];

          let elText = document.createTextNode(taskItem.text);
          el.appendChild(elText);
          document.body.appendChild(el);
        
      }
    });
  });

  //   let headingText = document.createTextNode("Hello World");
  //   heading.appendChild(headingText);

  console.log(document.body);
  console.log(document.body.innerHTML);
  return document.body.innerHTML;
}

export { generatePracticeTaskHTML };
