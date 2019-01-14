
const Joi = require('joi'); 
import * as mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
const config= require( 'config' );

export interface IOwners {
  clientId:ObjectId ;
  bookId: ObjectId ;
  alias: string ;
}

export interface IOwnerModel extends IOwners, mongoose.Document {
  //generateAuthToken():string ;
}


export var OwnerSchema =  new mongoose.Schema({ 
  clientId: {
    type: ObjectId,   
    required: true 
  },
  bookId: {
     type: Number,
     required: true 
  },
  alias: {
    type: ObjectId,
    minlength: 2,
    maxlength: 255
  } 
});

function validateOwner(owner) {
  const schema = {
    alias: Joi.string().min(2).max(255).required(),
    bookId: Joi.string().required(),
    clientId: Joi.string().required() 
  };
 
  return Joi.validate(owner, schema);
}

export const Owner: mongoose.Model<IOwnerModel> = mongoose.model<IOwnerModel>("Owner", OwnerSchema); 
export const validate: (any)=validateOwner ;
