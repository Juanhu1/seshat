import {Client, validate} from '../models/clients'; 
import * as mongoose from "mongoose" ;
//const auth = require('../middleware/auth');
import * as auth from '../middleware/auth' ;
import * as Express from "express" ;
const bcrypt = require('bcrypt');
//import bcrypt from 'bcrypt';
const _ = require('lodash');
let router = Express.Router(); 

//const {Client, validate} = require('../models/clients'); 
//const mongoose = require('mongoose');
//const express = require('express');
//const router = express.Router();
import {getUser} from '../controllers/clientController' ;

const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'OK' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};
const c = controllerHandler;
router.get('/:username', c(getUser, (req, res, next) => [req.params.username]));


router.get('/', auth, async (req, res) => {
  console.log("incoming get") ;
  const clients = await Client.find().sort('name');
  res.send(clients);
});

router.post('/', async (req, res) => {
  console.log("incoming post 1");
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  console.log("incoming post 2");
  let client = await Client.findOne({ email: req.body.email });
  if (client) return res.status(400).send('Client already registered.');
  
  client = new Client(_.pick(req.body, ['name', 'email', 'password','language']));
  console.log("incoming post 3 ->", client);
  const salt = await bcrypt.genSalt(10);
  client.password = await bcrypt.hash(client.password, salt);
  await client.save();
  console.log("incoming post 4");
  const token = client.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(client, ['_id', 'name', 'email']));
  console.log("incoming post 5");
});

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