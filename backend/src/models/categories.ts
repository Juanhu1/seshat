

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

export interface ICategories {
  name: string;
  limitation: string ;
}

export interface ICategoriestModel extends ICategories, mongoose.Document { 
}

export var CategoriesSchema =  new mongoose.Schema({ 
  name: {
    type: String,   
    required: true,
    minlength: 5,
    maxlength: 50
  },
  limitataion: {
     type: String,
  }
});

function validateCategories(categories) {
  const schema = {
    name: Joi.string().required,
    limitation: Joi.string()
  };
 
  return Joi.validate(categories, schema);
}

export const Client: mongoose.Model<ICategoriestModel> = mongoose.model<ICategoriestModel>("Categories", CategoriesSchema); 
export const validate: (any)=validateCategories ;
