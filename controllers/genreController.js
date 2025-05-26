const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenre = await Genre.find().sort({ _id: 1 }).exec();
  res.render("genre_list", {
    title: "Список Жанрів",
    genre_list: allGenre,
  });
});

// Відображення сторінки деталей для конкретного жанру.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Отримання деталей жанру та всіх пов'язаних книг (паралельно)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // Немає результатів.
    const err = new Error("Жанр не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Деталі жанру",
    genre: genre,
    genre_books: booksInGenre,
  });
});
   
// Відображення форми створення жанру на GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Створити жанр" });
};

// Обробка створення жанру на POST.
exports.genre_create_post = [
  // Валідація і санітизація поля 'name'
  body("name", "Назва жанру повинна містити мінімум 3 символи.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // Якщо є помилки – рендеримо форму з даними і помилками
      return res.render("genre_form", {
        title: "Створити жанр",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      try {
        // Перевірка на існуючий жанр (чутливість до регістру вимкнена)
        const existingGenre = await Genre.findOne({ name: req.body.name }).collation({ locale: "en", strength: 2 });

        if (existingGenre) {
          // Якщо жанр вже існує – редірект на його сторінку
          return res.redirect(existingGenre.url);
        } else {
          // Зберігаємо новий жанр і редіректимо на його сторінку
          await genre.save();
          return res.redirect(genre.url);
        }
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
