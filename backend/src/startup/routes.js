const express = require('express');
const clients = require('../routes/clients');
const auth = require('../routes/auth');
const categories = require('../routes/categories');
const books=require('../routes/books') ;
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/clients', clients);
  app.use('/api/categories', categories);
  app.use('/api/books', books);
  app.use('/api/auth', auth);
  app.use(error);
}