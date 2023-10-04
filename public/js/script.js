const photo = document.getElementsByClassName("mouse-teacher")[0];

let role = "admin"; // prompt("role");

if (role == "admin") {
  photo.style.opacity = 0;
}

let alertMessage = document.getElementsByClassName("alert")[0];
let code = document.getElementsByClassName("code");

const socket = io();


let files = document.querySelectorAll(".files .file");
let currentCursorPosition = { row: 0, column: 0 };
console.log(files);

for (let i = 0; i < files.length; i++) {
  let file = files[i];
  console.log(file);
  file.addEventListener("click", function () {
  console.log('file');

    let currentEditor = file.dataset.targetEditor;
    for (let i = 0; i < code.length; i++) {
      let currentCode = code[i];
      currentCode.classList.remove("active");
    }
    let activeEditor = document.querySelector(
      `[data-editor="${currentEditor}"]`
    );
    for (let i = 0; i < files.length; i++) {
      let currentFile = files[i];
      currentFile.classList.remove("active-file");
    }

    file.classList.add("active-file");
    activeEditor.classList.add("active");
    if (role == "admin") {
      socket.emit("click", {
        type: "open-editor",
        editor: currentEditor,
      });
    }
  });
}







socket.on("click", (data) => {
  console.log(1);

  if (data.type == "open-editor") {
    let el = document.querySelector(`[data-target-editor="${data.editor}"]`);
    el.click();
  }
});

// Функция для перевода текста на русский язык
function translateEditor() {
  require.config({
    paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" },
    "vs/nls": {
      availableLanguages: {
        "*": "ru", // Задаем язык по умолчанию для всех ключей
      },
    },
  });
}

translateEditor();

function createEditor(code) {
  console.log("555");
  console.log(code);
  require(["vs/editor/editor.main"], function () {
    var editorHTML = monaco.editor.create(
      document.getElementById("editor-html"),
      {
        value: code.html,
        language: "html",
        theme: "vs-dark",
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: "on",
        wrappingIndent: "indent",
        readOnly: false, // Разрешаем редактирование
      }
    );

    monaco.languages.registerCompletionItemProvider("html", {
      provideCompletionItems: function (model, position) {
        return {
          suggestions: [
            {
              label: "div",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<div>$1</div>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "img",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<img src="$1" alt="">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "b",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<b>$1</b>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "i",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<i>$1</i>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "s",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<s>$1</s>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "btn",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<button>$1</button>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h1",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h1>$1</h1>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h2",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h2>$1</h2>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h3",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h3>$1</h3>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h4",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h4>$1</h4>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h5",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h5>$1</h5>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h6",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<h6>$1</h6>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "audio",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<audio src="">$1</audio>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "p",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<p>$1</p>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "br",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<br>$1</br>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "input",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<input type="text">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "ul",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<ul>$1</ul>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "ol",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<ol>$1</ol>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "li",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "<li>$1</li>",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "code",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
</head>
<body>
  $1
</body>
</html>`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
          ],
        };
      },
    });

    var editorCSS = monaco.editor.create(
      document.getElementById("editor-css"),
      {
        value: code.css,
        language: "css",
        theme: "vs-dark",
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: "on",
        wrappingIndent: "indent",
        readOnly: false,
      }
    );

    monaco.languages.registerCompletionItemProvider("css", {
      provideCompletionItems: function (model, position) {
        return {
          suggestions: [
            {
              label: "bg",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "background: $1;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "ppp",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "c",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "color: ${1:red};",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "color",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "brs",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "border-radius: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "color",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "w",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "width: ${1:100}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "width",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "m",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "margin: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "margin",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "mt",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "margin-top: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "margin",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "ml",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "margin-left: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "margin",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "bd",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "border: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "border",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "mb",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "margin-bottom: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "margin",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "mr",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "margin-right: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "margin",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "p",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "padding: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "padding",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "pt",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "padding-top: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "padding",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "pl",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "padding-left: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "padding",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "pb",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "padding-bottom: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "padding",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "pr",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "padding-right: ${1:10}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "padding",
              documentation: "Represents a paragraph of text in HTML.",
            },
            {
              label: "h",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "height: ${1:30}px;",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "height",
              documentation: "Represents a paragraph of text in HTML.",
            },
          ],
        };
      },
    });

    var editorJS = monaco.editor.create(document.getElementById("editor-js"), {
      value: code.js,
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "on",
      wrappingIndent: "indent",
      readOnly: false,
    });

    let allEditors = [editorHTML, editorCSS, editorJS];

    var isHighlighted = false;
    var highlightedDecorations = [];
    var tooltip;

    function deleteLastSymbol() {
      const currentPosition = editorHTML.getPosition();
      const lastCharacterPosition = currentPosition.delta(-1, 0); // Move one character to the left
      const rangeToDelete = new monaco.Range(
        lastCharacterPosition.lineNumber,
        lastCharacterPosition.column,
        currentPosition.lineNumber,
        currentPosition.column
      );

      editorHTML.executeEdits("deleteLastSymbol", [
        { range: rangeToDelete, text: null },
      ]);
    }

    // Now you can call the function to delete the last symbol, for example:

//     editorHTML.addCommand(monaco.KeyCode.Enter, function () {
//       var editor = monaco.editor.getModels()[0];
//       var allCode = editor.getValue();
//       let lastSymbol = allCode.slice(allCode.length - 1);
//       console.log(lastSymbol);
//       if (lastSymbol == "!") {
//         deleteLastSymbol();
//         var startCode = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <title>Document</title>
// </head>
// <body>



// </body>
// </html>`;

//         editorHTML.trigger("keyboard", "type", { text: startCode });
//         var cursorPosition = editorHTML
//           .getModel()
//           .findMatches("<body>", false, false, false, null, false);
//         if (cursorPosition.length > 0) {
//           var line = cursorPosition[0].range.endLineNumber;
//           var column = cursorPosition[0].range.endColumn;
//           editorHTML.setPosition({ lineNumber: line + 2, column: 0 });
//         }

//         editorHTML.focus();
//         socket.emit("codeChange", allCode);
//         updatePreview();
//       }
//     });

    function updatePreview() {
      const htmlValue = monaco.editor.getModels()[0].getValue();
      const cssValue = monaco.editor.getModels()[1].getValue();
      const jsValue = monaco.editor.getModels()[2].getValue();

      const previewIframe = document.getElementById("preview-iframe");
      const iframeDocument = previewIframe.contentDocument;
      iframeDocument.open();
      iframeDocument.write(htmlValue);
      iframeDocument.write(`
            
            
            <style>
              ${cssValue}
            </style>
            
            <script>
${jsValue}
              <\/script>
            `);
      iframeDocument.close();
    }

    updatePreview();

    function toggleHighlight() {
      if (isHighlighted) {
        removeHighlight();
      } else {
        highlightText(3, 1, 6, 7);
      }
    }

    function handleHighlight(
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn
    ) {
      var range = new monaco.Range(
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn
      );
      editorHTML.setSelection(range);
      editorHTML.revealPositionInCenterIfOutsideViewport({
        lineNumber: startLineNumber,
        column: startColumn,
      });

      var decoration = {
        range: range,
        options: {
          inlineClassName: "highlighted-text",
        },
      };
      highlightedDecorations = editorHTML.deltaDecorations([], [decoration]);

      var startOffset = editorHTML.getOffsetForColumn(
        startLineNumber,
        startColumn
      );
      var tooltipX = startOffset.left + 8; // Position tooltip 8 pixels to the right of the highlighted text
      var tooltipY = editorHTML.getTopForLineNumber(startLineNumber) + 20; // Position tooltip 20 pixels below the highlighted text

      tooltip = document.createElement("div");
      // tooltip.textContent = "здесь есть ошибка";
      tooltip.className = "custom-tooltip";
      tooltip.style.left = tooltipX + "px";
      tooltip.style.top = tooltipY + "px";
      document.body.appendChild(tooltip);

      isHighlighted = true;
    }

    // let drawButton = document.getElementsByClassName("draw")[0];
    // let wrapperIframe = document.getElementsByClassName("wrapper-iframe")[0];
    // drawButton.addEventListener("click", function () {
    //   wrapperIframe.classList.toggle("activeDraw");
    // });

    function removeHighlight() {
      highlightedDecorations = editorHTML.deltaDecorations(
        highlightedDecorations,
        []
      );

      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }

      isHighlighted = false;
    }

    function showSelectionInfo() {
      try {
        var selection = editorHTML.getSelection();
        var startLineNumber = selection.startLineNumber;
        var startColumn = selection.startColumn;
        var endLineNumber = selection.endLineNumber;
        var endColumn = selection.endColumn;

        var cursorPosition = editorHTML.getPosition();
        var cursorLineNumber = cursorPosition.lineNumber;
        var cursorColumn = cursorPosition.column;

        var selectionInfoText = `Выделено: Строка ${startLineNumber}, Колонка ${startColumn} - Строка ${endLineNumber}, Колонка ${endColumn}`;
        var cursorInfoText = `Курсор: Строка ${cursorLineNumber}, Колонка ${cursorColumn}`;

        document.getElementById(
          "selectionInfo"
        ).innerText = `${selectionInfoText} | ${cursorInfoText}`;
      } catch (e) {}
    }

    function highlightLineTemporarily(lineNumber) {
      var range = new monaco.Range(lineNumber, 1, lineNumber, 1);
      var decoration = {
        range: range,
        options: {
          isWholeLine: true,
          inlineClassName: "highlighted-text",
        },
      };
      highlightedDecorations = editorHTML.deltaDecorations([], [decoration]);

      setTimeout(function () {
        removeHighlight();
      }, 1000);
    }

    function setCursorPosition() {
      const lineNumber = 117;
      const column = 4;
      const position = { lineNumber: lineNumber, column: column };
      editorHTML.setPosition(position);
      editorHTML.revealPositionInCenterIfOutsideViewport(position);
      editorHTML.focus();
      highlightLineTemporarily(lineNumber);
    }
    // Helper function for debouncing
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          timeout = null;
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Debounced version of the onDidChangeCursorSelection function
    const debouncedOnChangeCursorSelection = debounce(function (e) {
      var selection = editorHTML.getSelection();
      if (!selection.isEmpty()) {
        // Only execute the code when text is selected
        showSelectionInfo();
        var startLineNumber = selection.startLineNumber;
        var startColumn = selection.startColumn;
        var endLineNumber = selection.endLineNumber;
        var endColumn = selection.endColumn;

        console.log(startLineNumber, startColumn, endLineNumber, endColumn);
        handleHighlight(startLineNumber, startColumn, endLineNumber, endColumn);
        // You can also emit the highlight event to the server here if needed
        socket.emit("highlightText", {
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn,
        });
      }
    }, 70); // Adjust the wait time (in milliseconds) as needed (300ms in this example)

    function addButtonCode() {
      var buttonCode = "<button></button>";
      editorHTML.trigger("keyboard", "type", { text: buttonCode });
      editorHTML.trigger("keyboard", "type", { text: "\n" });
      editorHTML.focus();
    }

    function insertRectangleWithCustomClass(className) {
      var rectangleCode = `<div class="${className}"></div>`;
      editorHTML.trigger("keyboard", "type", { text: rectangleCode });
      editorHTML.focus();
    }

    // Обновляем текст при получении изменений от сервера
    socket.on("codeChange", (text) => {
      editorHTML.setValue(text);
      updatePreview();
    });

    // Обновляем текст и выделение при получении изменений от других клиентов
    socket.on("highlightText", (data) => {
      handleHighlight(
        data.startLineNumber,
        data.startColumn,
        data.endLineNumber,
        data.endColumn
      );
      updatePreview();
    });

    socket.on("unblock-code", () => {
      editorHTML.updateOptions({ readOnly: false });
      blockEditorButton.innerText = "Блокировать редактор";

      alertMessage.style.display = "none";
      updatePreview();
    });

    socket.on("block-code", () => {
      editorHTML.updateOptions({ readOnly: true });
      blockEditorButton.innerText = "Разблокировать редактор";
      alertMessage.style.display = "flex";

      updatePreview();
    });

    let isEditorLocked = false;

    function blockEditorToggle() {
      isEditorLocked = !isEditorLocked;
      const blockEditorButton = document.getElementById("blockEditorButton");
      if (isEditorLocked) {
        allEditors.forEach((editor) => {
          editor.updateOptions({ readOnly: true });
        });
        blockEditorButton.innerText = "Разблокировать редактор";

        socket.emit("block-code");
      } else {
        editor.updateOptions({ readOnly: false });
        blockEditorButton.innerText = "Блокировать редактор";
        socket.emit("unblock-code");
      }
    }

    // // Add an event listener for the "Удалить все выделения" button
    // document
    //   .getElementById("removeAllHighlightsButton")
    //   .addEventListener("click", removeAllHighlights);

    // Function to remove all highlights
    function removeAllHighlights() {
      // Remove all the highlighted decorations
      removeHighlight();

      // Remove the "highlighted-text" class from all elements after a small delay
      setTimeout(() => {
        const highlightedElements =
          document.getElementsByClassName("highlighted-text");
        while (highlightedElements.length > 0) {
          highlightedElements[0].classList.remove("highlighted-text");
          socket.emit("clear-hightlight");
        }
      }, 100); // Adjust the delay (in milliseconds) as needed

      // Update the preview
      updatePreview();
    }

    socket.on("clear-hightlight", function () {
      // Remove all the highlighted decorations
      removeHighlight();

      // Remove the "highlighted-text" class from all elements after a small delay
      setTimeout(() => {
        const highlightedElements =
          document.getElementsByClassName("highlighted-text");
        while (highlightedElements.length > 0) {
          highlightedElements[0].classList.remove("highlighted-text");
        }
      }, 100); // Adjust the delay (in milliseconds) as needed

      // Update the preview
      updatePreview();
    });
    // Функция для удаления подсвеченных текстов и подсказку
    // function removeHighlight() {
    //   highlightedDecorations = editor.deltaDecorations(
    //     highlightedDecorations,
    //     []
    //   );

    //   if (tooltip && tooltip.parentNode) {
    //     tooltip.parentNode.removeChild(tooltip);
    //   }

    //   isHighlighted = false;
    // }

    // document
    //   .getElementById("blockEditorButton")
    //   .addEventListener("click", blockEditorToggle);

    // document
    //   .getElementById("toggleButton")
    //   .addEventListener("click", toggleHighlight);
    // document
    //   .getElementById("setCursorPositionButton")
    //   .addEventListener("click", setCursorPosition);
    // document
    //   .getElementById("addButtonCodeButton")
    //   .addEventListener("click", addButtonCode);

    editorHTML.onKeyUp(function (e) {
      updatePreview();
      var editor = monaco.editor.getModels()[0];
      var allCode = editor.getValue();
      socket.emit("codeChange", allCode);
      updatePreview();
    });
    editorCSS.onKeyUp(function (e) {
      updatePreview();
      var editor = monaco.editor.getModels()[0];
      var allCode = editor.getValue();
      socket.emit("codeChange", allCode);
      updatePreview();
    });

    editorHTML.onDidChangeCursorSelection(debouncedOnChangeCursorSelection);

    editorHTML.onKeyDown(function (e) {
      if (
        e.keyCode === monaco.KeyCode.US_DOT &&
        !editorHTML.getSelection().isEmpty()
      ) {
        var selectedText = editorHTML
          .getModel()
          .getValueInRange(editorHTML.getSelection());
        insertRectangleWithCustomClass(selectedText);
      }
    });

    showSelectionInfo();
  });
}

// Получаем ссылку на фотографию и контейнер
socket.on("change-mouse", function (data) {
  photo.style.left = `${data.photoX}px`;
  photo.style.top = `${data.photoY}px`;
  updatePreview();
});
// Следим за перемещением мыши внутри контейнера
document.getElementById("app").addEventListener("mousemove", (event) => {
  if (role == "admin") {
    console.log(1);
    // Получаем координаты курсора мыши относительно контейнера
    const mouseX = event.clientX - document.body.offsetLeft;
    const mouseY = event.clientY - document.body.offsetTop;

    // Вычисляем новые координаты для фотографии (центрируем ее относительно курсора)
    const photoX = mouseX - photo.clientWidth / 2;
    const photoY = mouseY - photo.clientHeight / 2;

    // Устанавливаем новые координаты для фотографии
    photo.style.left = `${photoX}px`;
    photo.style.top = `${photoY}px`;
    socket.emit("change-mouse", { photoX, photoY });
  }
});

