'use strict';

function selectHandler(event) {
  let keyValue = event.target.value;
  $('.book-shelf').val(keyValue);
  console.log($('#bookShelf'));
}


function init() {
  $('.menu').on('click', menuHandler);
  $('.update-btn').on('click', updateHandler);
  $('.close-btn').on('click', closeHandler);
}

function menuHandler() {
  $('nav').toggleClass('nav-reveal');
}

function updateHandler(){
  $('.form-section').show();
  $('.update-btn').hide();
}

function closeHandler(event) {
  event.preventDefault();
  $(event.target).parent().hide();
  $('.update-btn').show();
}

$('select').on('change', selectHandler);