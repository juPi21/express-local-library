console.log('Заповнення бази даних зразковими даними...');

const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');
const BookInstance = require('./models/bookinstance');
const Genre = require('./models/genre');

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Помилка підключення до MongoDB:', err);
    process.exit(1);
  });

mongoose.Promise = global.Promise;

async function main() {
  await createGenres();
  await createAuthors();
  await createBooks();
  await createBookInstances();
  console.log('Готово!');
  mongoose.connection.close();
}

const genres = [];
const authors = [];
const books = [];

async function createGenres() {
  console.log('Створення жанрів...');
  const genreNames = ['Fantasy', 'Science Fiction', 'Romance'];

  for (let name of genreNames) {
    const genre = new Genre({ name });
    await genre.save();
    genres.push(genre);
    console.log(`Жанр створено: ${name}`);
  }
}

async function createAuthors() {
  console.log('Створення авторів...');
  const authorData = [
    { first_name: 'Іван', family_name: 'Франко', date_of_birth: new Date(1856, 8, 27), date_of_death: new Date(1916, 5, 28) },
    { first_name: 'Леся', family_name: 'Українка', date_of_birth: new Date(1871, 1, 25), date_of_death: new Date(1913, 7, 1) },
    { first_name: 'Ben', family_name: 'Bova', date_of_birth: new Date(1990, 0, 1) },
  ];

  for (let data of authorData) {
    const author = new Author(data);
    await author.save();
    authors.push(author);
    console.log(`Автор створено: ${author.name}`);
  }
}

async function createBooks() {
  console.log('Створення книг...');
  const bookData = [
    {
      title: 'Захар Беркут',
      author: authors[0]._id,
      summary: 'Історичний роман про боротьбу з монголо-татарами.',
      isbn: '1234567890123',
      genre: [genres[0]._id]
    },
    {
      title: 'Лісова пісня',
      author: authors[1]._id,
      summary: 'Поетична драма з елементами фентезі.',
      isbn: '9876543210987',
      genre: [genres[0]._id, genres[2]._id]
    }
  ];

  for (let data of bookData) {
    const book = new Book(data);
    await book.save();
    books.push(book);
    console.log(`Книга створена: ${book.title}`);
  }
}

async function createBookInstances() {
  console.log('Створення екземплярів книг...');
  const instanceData = [
    {
      book: books[0]._id,
      imprint: '1st edition, 2001',
      status: 'Available'
    },
    {
      book: books[1]._id,
      imprint: '2nd edition, 2005',
      status: 'Loaned',
      due_back: new Date(2025, 4, 30)
    }
  ];

  for (let data of instanceData) {
    const bookInstance = new BookInstance(data);
    await bookInstance.save();
    console.log(`Екземпляр створено: ${bookInstance.imprint}`);
  }
}

main().catch(err => console.error(err));
