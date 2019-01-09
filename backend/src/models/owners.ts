

//tipp: https://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/
//https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-2-98c34e3513a2
//https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-1-2-195bdaf129cf
//https://ramlez.com/blog/node-js-typescript-2-x-mongodb-quick-start-2/

//const Joi = require('joi');   
//import Joi from "joi" ;
const Joi = require('joi'); 
import * as mongoose from 'mongoose';
const config= require( 'config' );

export interface IOwners {
  clientId:Number ;
  bookId: Number ;
  alias: string ;
}

export interface IOwnerModel extends IOwners, mongoose.Document {
  //generateAuthToken():string ;
}


//sconsole.log(mongoose) ;
export var OwnerSchema =  new mongoose.Schema({ 
  clientId: {
    type: Number,   
    required: true 
  },
  bookId: {
     type: Number,
     required: true 
  },
  alias: {
    type: String,
    minlength: 2,
    maxlength: 255
  } 
});

 

OwnerSchema.methods.generateAuthToken = function() { 
 
  return  ;
}

function validateClient(owner) {
  const schema = {
    alias: Joi.string().min(2).max(255).required(),
    bookId: Joi.string().required(),
    clientId: Joi.string().required() 
  };
 
  return Joi.validate(owner, schema);
}

export const Owner: mongoose.Model<IOwnerModel> = mongoose.model<IOwnerModel>("Client", OwnerSchema); 
export const validate: (any)=validateClient ;
