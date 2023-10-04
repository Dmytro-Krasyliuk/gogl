function hasVariable(variableName) {
  try {
    eval(variableName);
    return true;
  } catch (error) {
    return false;
  }
}

function setOpacity(value) {
  localStorage.setItem("opacity", value);
  console.log("value: " + value);
  document.getElementsByClassName("result")[0].style.opacity = value;
  document.getElementsByClassName("slider")[0].value = value;
}

// function getFunctionType(func) {
//   if (typeof func === "function") {
//     if (func.name) {
//       return func.name; // Named function
//     } else if (func.toString().startsWith("function")) {
//       return "anonymous function"; // Anonymous function
//     } else if (func.toString().startsWith("async")) {
//       return "async function"; // Async function
//     } else if (func.toString().includes("=>")) {
//       return "arrow function"; // Arrow function
//     } else {
//       return "function";
//     }
//   }
//   return "not a function";
// }

// // Examples
// console.log(getFunctionType(function () {})); // Output: "anonymous function"
// console.log(getFunctionType(() => {})); // Output: "arrow function"
// console.log(getFunctionType(async function () {})); // Output: "async function"
// console.log(getFunctionType(function namedFunc() {})); // Output: "namedFunc"
// console.log(getFunctionType("not a function")); // Output: "not a function"

console.log(180);
function initProject(idStudent, idTask, imageResult) {
  console.log(181);
  let tasks;
  fetch(`https://practice2-j4q4.onrender.com/getTasks/${idStudent}/${idTask}`)
    .then((res) => res.json())
    .then((json) => {
      tasks = json.data.tasks;

      let main = document.getElementsByClassName("main")[0];
      let body = document.getElementsByTagName("body")[0];

      document.body.innerHTML += `
        <button class="toggle-button">
          <span class="icon icon-show">&#9656;</span>
          <span class="icon icon-hide">&#9662;</span>
          <span class="text text-btn-result">Показати шаблон</span>
        </button>

        <input type="range" class="slider" min="0.15" max="1" step="0.01" value="0" oninput="setOpacity(this.value)">

        <img class="result" src="${imageResult}" alt="">
      `;

      const toggleResultButton = document.querySelector(".toggle-button");
      const textResultButton =
        toggleResultButton.querySelector(".text-btn-result");
      const resultContainer = document.querySelector(".result");

      toggleResultButton.addEventListener("click", function () {
        resultContainer.classList.toggle("active");
        textResultButton.textContent =
          textResultButton.textContent === "Приховати шаблон"
            ? "Показати шаблон"
            : "Приховати шаблон";
      });

      const slider = document.querySelector(".slider");

      slider.addEventListener("input", function () {
        const value = parseFloat(slider.value);
        setOpacity(value);
        mainElement.textContent = value;
      });

      body.innerHTML += `<div class="tasks"></div>`;
      body.innerHTML += `<button class="tasks-next">Наступне завдання</button>`;
      body.innerHTML += `<button class="tasks-end">Готово <span class="task-b-wrapper">+ <span class="task-b">0</span> б.</span></button>`;

      let tasksConfirm = document.getElementsByClassName("tasks-end")[0];
      let tasksParent = document.getElementsByClassName("tasks")[0];

      let showResult = document.getElementsByClassName("toggle-button")[0];
      let textResult = document.getElementsByClassName("text-btn-result")[0];
      let result = document.getElementsByClassName("result")[0];

      showResult.addEventListener("click", function () {
        result.classList.toggle("active");
        if (textResult.textContent === "Приховати шаблон") {
          textResult.textContent = "Показати шаблон";
        } else {
          textResult.textContent = "Приховати шаблон";
        }
      });

      for (let i = 0; i < tasks.length; i++) {
        tasksParent.innerHTML += `
          <div class="tasks-item error">
            <div class="tasks-item__text">${tasks[i].title}</div>
            <div class="tasks-item__value">${tasks[i].label}</div>
          </div>
        `;
      }

      let readyTasks = [];

      for (let i = 0; i < tasks.length; i++) {
        readyTasks[i] = 0;
      }

      function markReadyTask(index) {
        document
          .getElementsByClassName("tasks-item")
          [index].classList.add("success");
        document
          .getElementsByClassName("tasks-item")
          [index].classList.remove("error");
        readyTasks[index] = 1;
        updateAmountBall();
      }

      function markNoReadyTask(index) {
        document
          .getElementsByClassName("tasks-item")
          [index].classList.remove("success");
        document
          .getElementsByClassName("tasks-item")
          [index].classList.add("error");
        readyTasks[index] = 0;
        updateAmountBall();
      }

      function updateAmountBall() {
        let amountReadyTasks = 0;
        for (let i = 0; i < readyTasks.length; i++) {
          amountReadyTasks += readyTasks[i];
        }
        document.querySelector(".task-b").textContent = amountReadyTasks;
      }

      setInterval(function () {
        var iframe = document.getElementById("preview-iframe");

        var iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;

        tasks.forEach((check, index) => {
          check.check.forEach((checkEl) => {

            if (checkEl.type == "cssValue") {
              try {
                let el = iframeDocument.querySelector(checkEl.selector);
                let cssCurrentValue = getComputedStyle(el)[checkEl.command];
                if (cssCurrentValue == checkEl.value) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              } catch (e) {}
            }

            if (checkEl.type == "jsVariableLength") {
              try {
                if (eval(checkEl.selector).length == checkEl.length) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              } catch (e) {}
            }

            if (checkEl.type == "jsVariableType") {
              if (checkEl.typeOF == "object") {
                if (
                  Object.prototype.toString.call(eval(checkEl.selector)) ===
                  "[object Object]"
                ) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              }

              if (checkEl.typeOF == "string") {
                if (typeof eval(checkEl.selector) == "string") {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              }

              if (checkEl.typeOF == "array") {
                try {
                  let data = eval(checkEl.selector);
                  if (Array.isArray(data)) {
                    markReadyTask(index);
                  } else {
                    markNoReadyTask(index);
                  }
                } catch (e) {}
              }
            }

            try {
              if (checkEl.type == "jsIsVariable") {
                if (hasVariable(checkEl.selector)) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              }
            } catch (e) {}

            if (checkEl.type == "attrHTMLElement") {
              try {
                let element = iframeDocument.querySelector(checkEl.selector);
                if (element.getAttribute(checkEl.attr) == checkEl.attrValue) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              } catch (e) {}
            }

            if (checkEl.type == "cssHoverValue") {
              try {
                let element = iframeDocument.querySelector(checkEl.selector);
                let resultCSS = document.getElementById(
                  "INLINE_PEN_STYLESHEET_ID"
                ).innerHTML;
                let opacityValue = localStorage.getItem("opacity");
                if (opacityValue != null) {
                  setOpacity(opacityValue);
                }
                var searchString = ":hover";
                var replacementString = "::after";
                var modifiedString = resultCSS.replace(
                  new RegExp(searchString, "g"),
                  replacementString
                );
                let styleTag = document.createElement("style");
                styleTag.innerHTML = modifiedString;
                document.body.appendChild(styleTag);
                let result = getComputedStyle(element, ":after")[
                  checkEl.command
                ];
                if (result == checkEl.value) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              } catch (e) {}
            }

            if (checkEl.type == "htmlElement") {
              let el = iframeDocument.querySelector(checkEl.selector);
              try {
                if (el) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              } catch (e) {}
            }

            try {
              if (checkEl.type == "classElement") {
                let el = iframeDocument.querySelector(checkEl.selector);
                if (el && el.classList.contains(checkEl.className)) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              }
            } catch (e) {}

            try {
              if (checkEl.type == "textHTMLElement") {
                let el = iframeDocument.querySelector(checkEl.selector);
                if (
                  el &&
                  el.textContent.trim().toLowerCase() ==
                    checkEl.text.trim().toLowerCase()
                ) {
                  markReadyTask(index);
                } else {
                  markNoReadyTask(index);
                }
              }
            } catch (e) {}
          
          });
        });
      }, 1000);

      sendResult("updateInfo");
      setInterval(function () {
        sendResult("updateInfo");
      }, 30000);

      tasksConfirm.addEventListener("click", function () {
        sendResult("sendInfo");
      });

      function sendResult(type) {
        const token = "6183220599:AAGzgg3MrVrxu2lu92WoBRRpLWanGa2UmWU";
        let student = idStudent;
        link = location.href;
        let resultHTML = encodeURIComponent(
          document.querySelectorAll(".main")[0].innerHTML
        );

        myId = idStudent;

        let resultCSS = "css default 009";
        let resultJS = "";
        let scripts = document.body.getElementsByTagName("script");
        let path = scripts[scripts.length - 1].src;

        fetch(path)
          .then((result) => result.text())
          .then((res) => {
            resultJS = res;

            let dataResult = {
              type: type,
              idTask: idTask,
              idStudent: idStudent,
              link: link,
              successTask: readyTasks,
              code: {
                html: resultHTML,
                css: resultCSS,
                js: resultJS,
              },
            };

            const url = "https://practice2-j4q4.onrender.com/set/practice";

            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataResult),
            })
              .then((response) => response)
              .then((data) => {})
              .catch((error) => {});
          });

        // sendURL = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${myId}&text=${templateURL}&parse_mode=markdown`;

        // fetch(sendURL)
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
