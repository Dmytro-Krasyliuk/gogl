import mongoose, { Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://dimanice:dimanice@dimanice.qqa3tdt.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

let practiceSchema = new Schema({
  id: { type: String },
  name: { type: String },
  description: { type: String },
  type: { type: String },
  level: { type: Number },
  themes: { type: Array },
  codeResult: {
    html: { type: String },
    css: { type: String },
    js: {type: String},
  },
  tasks: [
    {
      title: { type: String },
      label: { type: String },
      description: { type: String },
      check: { type: Array },
    },
  ],
  data: {
    html: { type: String },

    css: { type: String },
    js: { type: String },
  },
});

let Practice = mongoose.model("practice", practiceSchema);

const schema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  car: { type: String },
  name: { type: String },
  days: { type: Array },
  pay: {
    day: { type: String },
    month: { type: String },
    year: { type: String },
    sum: { type: String },
    isPay: { type: Boolean },
  },
  events: { type: Array },
  quiz: {
    allMoney: { type: Number },
    currentMoney: { type: Number },
    lastResultMoney: { type: Number },
  },
  contact: { type: Array },
  english: { type: Array },

  idGroup: { type: String },
  diamonds: { type: Number },
  themes: { type: Array },
});

let User = mongoose.model("User", schema);

const studentListPracticeSchema = new Schema({
  idPractice: {type: String},
  photo: {type: String},
  students: [
    {
      idStudent: { type: Number },
      result: {
        successTask: { type: Array },
        wrongTask: { type: Array },
      },
      historyCode: [
        {
          html: { type: String },
          css: { type: String },
          js: { type: String },
        },
      ],
      finish: { type: Boolean },
      grade: { type: Number },
      time: { type: String },
      finishCode: {
        html: { type: String },
        css: { type: String },
        js: { type: String },
      },
    },
  ],
});

let studentListPractice = mongoose.model(
  "studentListPractice",
  studentListPracticeSchema
);

export { Practice, User, studentListPractice };
