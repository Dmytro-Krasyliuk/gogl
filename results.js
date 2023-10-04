let results = [
  {
    id: "-1001737433380",
    answerSum: { right: 6, error: 1, notData: 0 },
  },
  {
    id: "-1001912511441",
    answerSum: { right: 8, error: 1, notData: 2 },
  },
  {
    id: "-1001912511442",
    answerSum: { right: 2, error: 3, notData: 0 },
  },
  ,
  {
    id: "-1001912511443",
    answerSum: { right: 10, error: 0, notData: 0 },
  },
];

let sortListResults = results.sort((a, b) =>
  a.answerSum.right < b.answerSum.right ? 1 : -1
);
let text = `
Результати тестів:

`;
sortListResults.forEach((student) => {
    let percent = student.answerSum.right /(
      student.answerSum.error +
        student.answerSum.notData +
        student.answerSum.right
    );
    let grade = percent < 0.2 ? 6 : percent < 0.3 ? 7 : percent < 0.4 ? 8 : percent < 0.5 ? 9 : percent < 0.6 ? 10 : percent <= 0.8 ? 11 : percent > 0.8 ? 12 : undefined;
    text += `
<b>1. ${student.id}</b>
✅ Правильних: ${student.answerSum.right}
❌ Неправильних: ${student.answerSum.error}
🔘 Немає відповіді: ${student.answerSum.notData}
% Правильних: ${percent.toFixed(2)*100}%
<b>Оцінка: ${grade} балів</b>
 

`;
})

console.log(text);


