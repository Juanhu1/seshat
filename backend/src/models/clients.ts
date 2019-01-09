

//tipp: https://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/
//https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-2-98c34e3513a2
//https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-1-2-195bdaf129cf
//https://ramlez.com/blog/node-js-typescript-2-x-mongodb-quick-start-2/

//const Joi = require('joi');   
//import Joi from "joi" ;
const Joi = require('joi'); 
import * as mongoose from 'mongoose';
const jwt= require( 'jsonwebtoken' ) ;
const config= require( 'config' );

export interface IClient {
  name: string;
  email: string;
  password: string;
  registrationDate: Date ;
  lastLoginDate : Date ;
  accountInfo: string ;
  language:string ;
}

export interface IClientModel extends IClient, mongoose.Document {
  generateAuthToken():string ;
}


//sconsole.log(mongoose) ;
export var ClientSchema =  new mongoose.Schema({ 
  name: {
    type: String,   
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
     type: String,
     required: true,
     minlength: 5,
     maxlength: 255
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastLoginDate : {
    type: Date,
    required: true,
    default: Date.now
  },
  accountInfo: {
      type: String
  }, 
  language: {
      type: String,
      required: true 
  }
});

ClientSchema.pre("save", function(next) {
 /* let now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }*/
  next();
});

ClientSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

function validateClient(client) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    language: Joi.string().required() 
  };
 
  return Joi.validate(client, schema);
}

export const Client: mongoose.Model<IClientModel> = mongoose.model<IClientModel>("Client", ClientSchema); 
export const validate: (any)=validateClient ;
