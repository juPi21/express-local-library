require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require("./express-locallibrary/routes/index");
var usersRouter = require("./express-locallibrary/routes/users.js");
const compression = require("compression");
const helmet = require("helmet");
const catalogRouter = require("./express-locallibrary/routes/catalog.js"); // Імпортуйте маршрути для розділу сайту "catalog"
const compression = require("compression");

// Створіть об'єкт застосунку Express

const catalogRouter = require("./express-locallibrary/routes/catalog.js"); 
const connectDB = require('./express-locallibrary/db.js');
connectDB(); 

const app = express();

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 хвилина
  max: 20,
});
// Застосуйте обмеження швидкості до всіх запитів
app.use(limiter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Стисніть усі маршрути
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);


module.exports = app;
