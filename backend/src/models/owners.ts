
const Joi = require('joi'); 
import * as mongoose from 'mongoose';
//import { ObjectID } from 'bson';
const config= require( 'config' );

export interface IOwners {
  clientId:String ;
  bookId: String ;
  alias: string ;
}

export interface IOwnerModel extends IOwners, mongoose.Document {
  //generateAuthToken():string ;
}


export var OwnerSchema =  new mongoose.Schema({ 
  clientId: {
    type: String,   
    required: true 
  },
  bookId: {
     type: String,
     required: true 
  },
  alias: {
    type: String,
    minlength: 2,
    maxlength: 255
  } 
});

function validateOwner(owner) {
  const schema = {
    alias: Joi.string().min(2).max(255).required(),
    bookId: Joi.any().required(),
    clientId: Joi.string().required() 
  };
 
  return Joi.validate(owner, schema);
}

export const Owner: mongoose.Model<IOwnerModel> = mongoose.model<IOwnerModel>("Owner", OwnerSchema); 
export const validate: (any)=validateOwner ;
