// ******** Розсилка кожного дня о 10:00
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// cron.schedule("0 10 * * *", async function () {
//   const users = await User.find({});

//   for (let i = 0; i < users.length; i++) {
//     bot.sendMessage(users[i].idGroup, "Ваше сообщение здесь");
//     await delay(2000); // Ждем 2 секунды перед следующей отправкой
//   }
// });

// ******** Додати нове поле
// let a = await User.updateMany(
//   {}, // Условие выбора (пустое означает выбор всех)
//   { $set: { diamonds: 0 } }
// );
// console.log(a);

// ******** Chat GPT
// // Вставьте ваш API-ключ здесь
// const API_KEY = "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";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${API_KEY}`,
// };

// const prompt = "Какой сегодня день?";
// const maxTokens = 150;

// const data = {
//   prompt: prompt,
//   max_tokens: maxTokens,
// };

// let client = axios.create({
//   headers: {
//     Authorization: 'Bearer ' + API_KEY
//   }
// })

// let params = {
//   prompt: 'Как создать кнопку в html?',
//   model: 'text-davinci-003',
//   max_tokens: 1000,
//   temperature: 0.7,
// }

// client
//   .post("https://api.openai.com/v1/completions", params)
//   .then((result) => {
//     console.log(result.data.choices[0].text);
//   })
//   .catch((err) => {
//     console.log("error", err);
//   });

// ******** Зображення

// app.post("/process-image", async (req, res) => {
//   try {
//     const { imageUrl } = req.body;

//     const response = await fetch(imageUrl);
//     const buffer = await response.buffer();

//     const decodedImage = tf.node.decodeImage(buffer);
//     const model = await load();
//     const predictions = await model.detect(decodedImage);
//     decodedImage.dispose();

//     res.json(predictions);
//   } catch (error) {
//     console.error("Ошибка при обработке изображения:", error);
//     res.status(500).json({ error: "Ошибка при обработке изображения" });
//   }
// });

// ***** Ефект друку
//    // Send the initial message
//    const message = await bot.sendMessage(chatId, "П");

//    // Get the message ID for future editing
//    const messageId = message.message_id;

//    // Simulate a typing effect
//    let text1 = "П";
//    const fullText = `Привіт, dimanice! 🥳
// Ми починаємо наші заняття по програмуванню!
// Ось уся необхідна інформація, яка стосується нашого навчання:
// 🔐 Постійні доступи до занять:`;

//     for (let i = 1; i < fullText.length; i++) {
//       try{
//       if (
//         (fullText[i] === " " || fullText[i] === "\n") &&
//         i + 1 < fullText.length
//       ) {
//         text1 += fullText[i] + fullText[i + 1];
//         i++; // Skip the next character since we've already added it
//       } else {
//         text1 += fullText[i];
//       }

//       await bot.editMessageText(text1, {
//         chat_id: chatId,
//         message_id: messageId,
//       });
//       await new Promise((resolve) => setTimeout(resolve, 150)); // Задержка в 200 миллисекунд
//     } catch(e) {}

//     }

// let ddata = [
//   {
//     id: uuid(),
//     title: "Оберіть те що можна написати в тег address",
//     description: "description 1",
//     options: [
//       "+38 050 014 15",
//       "ноутбук Lenovo",
//       "Замовити",
//       "будь-яке зображення",
//     ],
//   },
//   {
//     id: uuid(),
//     title: "Оберіть те що можна написати в тег address 2",
//     description: "description 2",
//     options: [
//       "+38 050 014 15 2",
//       "ноутбук Lenovo 2",
//       "Замовити 2",
//       "будь-яке зображення 2",
//     ],
//   },
// ];

// bot.sendMessage(
//   chatId,
//   "click me 2",
//   keyboards.openApp("https://codepen.io/DimaNice/full/OJBodYj")
// );

// await studentListPractice.deleteMany({});
