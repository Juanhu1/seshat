//import {Client, validate} from '../models/clients'; 
//import * as mongoose from "mongoose" ;
//const auth = require('../middleware/auth');
import * as auth from '../middleware/auth' ;
import * as Express from "express" ;
//const bcrypt = require('bcrypt');
//import bcrypt from 'bcrypt';
const _ = require('lodash');
let router = Express.Router(); 

//const {Client, validate} = require('../models/clients'); 
//const mongoose = require('mongoose');
//const express = require('express');
//const router = express.Router();
import {getUser, getAllUser, addUser} from '../controllers/clientController' ;

const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'Failed' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};

router.get('/:username', controllerHandler(getUser,    (req, res, next) => [req.params.username]));
router.get('/',          controllerHandler(getAllUser, (req, res, next) => [])) ;

//router.post('/',         controllerHandler(addUser,    (req, res, next) => [res, _.pick(req.body, ['name', 'email', 'password','language'])])) ;
router.post('/', async (req, res, next) => {
  try {
     let token:string=await addUser( _.pick(req.body, ['name', 'email', 'password','language'])) ;
     res.header('x-auth-token', token).send(_.pick(req.body, ['name', 'email']));
  } catch (error) {
     return res.status(500) && next(error);
  }
} ) ;

/*
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let client = await Client.findOne({ email: req.body.email });
  if (client) return res.status(400).send('Client already registered.');
  client = new Client(_.pick(req.body, ['name', 'email', 'password','language']));
  const salt = await bcrypt.genSalt(10);
  client.password = await bcrypt.hash(client.password, salt);
  await client.save();
  const token = client.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(client, ['_id', 'name', 'email']));
});
*/
/*
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});
*/
module.exports = router; 