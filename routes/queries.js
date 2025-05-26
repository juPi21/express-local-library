const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

/* GET books with optional title filter using RegExp */
router.get("/books", async function (req, res, next) {
  try {
    const titleQuery = req.query.title;
    let filter = {};

    if (titleQuery) {
      // Створюємо регулярний вираз (нечутливий до регістру)
      filter.title = { $regex: new RegExp(titleQuery, "i") };
    }

    // Знаходимо книги з фільтром і підставляємо автора
    const books = await Book.find(filter).populate("author");

    if (books.length === 0) {
      return res.send("<h1>No books found</h1>");
    }

    // Формуємо відповідь
    const result = books
      .map(
        (book) =>
          `${book.title} by ${book.author.first_name} ${book.author.family_name}`
      )
      .join("<br>");

    res.send(`<h1>Books found:</h1><p>${result}</p>`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;