import { students } from "../data.js";
let sumMoney = 0;
let result = (chatId) => {
let templateResult = ``;
for (let i = 0; i < students.length; i++) {
    if (students[i].idGroup == chatId) {
        templateResult += `Вас звати: ${students[i].name} ${students[i].lastName}. У вас на балансі: ${students[i].quiz.currentMoney}`;
    }
}
for (let i = 0; i < students.length; i++) {
    templateResult += `⚡️ ${students[i].name}  ${students[i].lastName}  (💰 ${students[i].quiz.allMoney}  грн)\n`;
}

return templateResult;
}


export {
    result
}