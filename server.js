'use strict';

//dependencies, port config, and setting up client.
const express = require('express');
require('dotenv').config();
require('ejs');
const methodOverride = require('method-override');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT || 3001;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

//this allows urlencoded parsing.
app.use(express.urlencoded({extended:true}));
//set view engine to ejs so ejs are readable
app.set('view engine', 'ejs');
//set static files in public so they can be used on the front-end.
app.use(express.static('public'));
//this displays current books from database
app.get('/', renderBookIndex);
//this renders the search page.
app.get('/new', newSearch);
//this handles the search query for Google Books API
app.post('/searches', searchBook);
//this handles adding book to database (and redirect to singleBook to display in detail page)
app.post('/add', addBook);
//this handles rendering detail page of single book
app.get('/books/:id', singleBook);
//this is general error handling
app.get('*', handleError);

//this is method override for PUT and DELETE in form
app.use(methodOverride((request, response) => {
  if(request.body && typeof request.body === 'object' && '_method' in request.body){
    // look in the urlencoded POST body and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

//This function handles fetching book data from database and render them on index.ejs 
function renderBookIndex(req, res){
  let SQL = 'SELECT * FROM books';
  client.query(SQL)
    .then(results => {
      const booksArr = results.rows
      res.render('pages/index', {books: booksArr});
    })
}

//renders search page to search in Google Book API
function newSearch(req, res){
  res.render('pages/searches/new');
}

//This function handles the fetching of API data based on search request, put the data through constructor and output them into show page with formatted info.
function searchBook(req, res){
  const searchedFor = req.body.search[0];
  const typeOfSearch = req.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(typeOfSearch === 'title'){
    url += `+intitle:${searchedFor}`;
    console.log(url);
  }

  if(typeOfSearch === 'author'){
    url += `+inauthor:${searchedFor}`;
  }

  superagent.get(url)
    .then(results => {
      const bookArray = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      })
      res.status(200).render('pages/searches/show', {books: bookArray});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('server error.');
    });
}

//addBook happens when user submit a book into the database then redirect the user to single book detail page.
function addBook(req, res) {
  let {author, title, isbn, image_url, description, bookshelf} = req.body;
  let SQL = 'INSERT INTO books(author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) returning id;';
  let safeValues = [author, title, isbn, image_url, description, bookshelf];

  client.query(SQL,safeValues)
    .then(results =>{
      console.log(results.rows[0].id);
      let id = results.rows[0].id;
      res.redirect(`/books/${id}`);
    })
    .catch(err => handleError(err, res));
}

//This function renders a single book (and all of its info) on the show.ejs
function singleBook(req, res){
  const sql = `SELECT * FROM books WHERE id=$1;`;
  const safeValues = [req.params.id];

  client.query(sql, safeValues)
    .then(sqlResults => {
      const selectedBook = sqlResults.rows[0];
      res.render('pages/books/show', {bookInfo:selectedBook})
    })
    .catch(err => {console.error(err)});
}

//this is the Book constructor that handles data formatting.
function Book(bookObject){
  const placeholder = `https://i.imgur.com/J5LVHEL.jpg`;
  let regex = /^(http:)/g;
  let isbnStr;
  if(regex.test(bookObject.image)) {
    bookObject.image.replace(regex, 'https:');
  }
  if(bookObject.industryIdentifiers !== undefined) {
    isbnStr = `${bookObject.industryIdentifiers[0].type} ${bookObject.industryIdentifiers[0].identifier}`;
  } else {
    isbnStr = 'no isbn available';
  }

  this.image_url = bookObject.imageLinks.thumbnail || placeholder;
  this.title = bookObject.title || 'no title available';
  this.author = bookObject.authors || 'no author info available';
  this.isbn = isbnStr || 'no isbn available';
  this.description = bookObject.description || 'no description available';
}

//this function handles all incoming errors
function handleError(req, res) {
  res.render('pages/error', { error: 'Uh Oh' });
}

//connecting DB and start server on port
client.connect()
  .then(() => {
    console.log('connected to db');
    app.listen(PORT, () => console.log(`app is listening on ${PORT}`));
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  })
