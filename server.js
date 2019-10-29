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

function newPage(req, res){
  // let regex = /^(http:)/g;
  // let url =
  res.render('pages/index');
}

function bookSearch(req, res){
  console.log(req.body.search);

  const searchedFor = req.body.search[0];
  const typeOfSearch = req.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(typeOfSearch === 'title'){
    url += `+intitle:${searchedFor}`;
  }

  if(typeOfSearch === 'author'){
    url += `+inauthor:${searchedFor}`;
  }

  superagent.get(url)
    .then(results => {
      const bookArray = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      })
      res.status(200).render('pages/searches/show');
    })
}

function Book(bookObject){
  const placeholder = `https://i.imgur.com/J5LVHEL.jpg`;
  this.cover = bookObject.image || placeholder;
  this.title = bookObject.title || 'no title available';
  this.author = bookObject.author || 'no author info available';
  this.description = bookObject.description || 'no description available';
}

app.listen(PORT, () => {
  console.log(`living on ${PORT}`);
})
