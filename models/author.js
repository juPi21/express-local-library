const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Віртуальне поле для повного імені автора
AuthorSchema.virtual("name").get(function () {
  // Щоб уникнути помилок у випадках, коли автор не має ні прізвища, ні імені
  // Ми хочемо переконатися, що ми обробляємо виняток, повертаючи порожній рядок для цього випадку
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name} ${this.family_name}`;
  } else if (this.first_name) {
    fullname = this.first_name; // Якщо тільки ім'я
  } else if (this.family_name) {
    fullname = this.family_name; // Якщо тільки прізвище
  }

  return fullname;
});

// Віртуальне поле для URL автора
AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});
AuthorSchema.virtual("lifespan").get(function () {
  const birth = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";

  const death = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";

  return `${birth} – ${death}`;
});

// Експортуємо модель
module.exports = mongoose.model("Author", AuthorSchema);
