
const Joi = require('joi'); 
import * as mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
const config= require( 'config' );

export interface IBook {
  title:string ;
  visible: string ;
  shared: string ;
  useSnowFlake: boolean ;
  creationDate: Date ;
  language: string ;
  price: string ;
  currency: string ;
  password: string ;
  alias: string ;  
}

export interface IBookModel extends IBook, mongoose.Document {
  //generateAuthToken():string ;
}


export var BookSchema =  new mongoose.Schema({ 
  title: {
    type: String,   
    required: true 
  },
  visible: {
     type: String,
  },
  shared: {
    type: String,
  },
  useSnowFlake:{
      type:Boolean,
      default: false 
  },
  creationDate: {
      type: Date,
      default: Date.now()       
  },
  language: {
      type: String
  },
  price: { 
      type: String
  },
  currency:{ 
      type: String
  },
  password: {
      type: String
  }
});

function validateBook(owner) {
  const schema = {
    title: Joi.string().required(),
    visible: Joi.string(),
    useSnowFlake: Joi.boolean(),
    creationDate: Joi.Date(),
    language: Joi.string(), 
    price: Joi.string(),
    currency: Joi.string(),
    password: Joi.string()    
  };
 
  return Joi.validate(owner, schema);
}

export const Book: mongoose.Model<IBookModel> = mongoose.model<IBookModel>("Book", BookSchema); 
export const validate: (any)=validateBook ;
