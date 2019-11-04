'use strict';

function selectHandler(event) {
  let keyValue = event.target.value;
  $('.book-shelf').val(keyValue);
  console.log($('#bookShelf'));
}

function init() {
  $('.menu').on('click', menuHandler);
}

function menuHandler() {
  $('nav').toggleClass('nav-reveal');
}

$('select').on('change', selectHandler);
