import moment from "moment";

function goodMonth() {
    let month = JSON.stringify(moment().month()+1);
    if (month.length == 1) {
        month = "0" + month; 
    }
    return month;
}
function goodDay() {
  let day = JSON.stringify(moment().date());
  if (day.length == 1) {
    day = "0" + day;
  }
  return day;
}


let time = {
  year: moment().year(), // День недели (1-7)
  month: goodMonth(), // День недели (1-7)
  day: goodDay(), // День недели (1-7)
  hour: moment().hour(),
  minute: moment().minute(),
};
export default time;
