'use strict';

const express = require('express');
require('dotenv').config();
require('ejs');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', newPage);
app.post('/searches', bookSearch);
app.get('*', handleError);

function newPage(req, res){
  // let url =
  res.render('pages/index');
}

function bookSearch(req, res){
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
      res.status(200).render('pages/searches/show', {bookList: bookArray});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('server error.');
    });
}

function Book(bookObject){
  const placeholder = `https://i.imgur.com/J5LVHEL.jpg`;
  let regex = /^(http:)/g;
  if(regex.test(bookObject.image)) {
    bookObject.image.replace(regex, 'https:');
  }

  this.cover = bookObject.imageLinks.thumbnail || placeholder;
  this.title = bookObject.title || 'no title available';
  this.authors = bookObject.authors || 'no author info available';
  this.description = bookObject.description || 'no description available';
}


function handleError(request, response) {
  response.status(404).send('Server connection problem');
}


app.listen(PORT, () => {
  console.log(`living on ${PORT}`);
})
