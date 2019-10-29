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

app.get('/hello', newPage);

function newPage(req, res){
  res.render('pages/index');
}

app.listen(PORT, () => {
  console.log(`living on ${PORT}`);
})
