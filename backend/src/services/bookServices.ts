
import {Book, IBook, IBookModel, validate as bookValidate} from '../models/books'; 
import {Owner, IOwnerModel, validate as ownerValidate, IOwners} from '../models/owners'; 

import { ObjectID, ObjectId } from 'bson';
import * as mongoose from 'mongoose';
import {Fawn} from 'fawn' ;

Fawn.init(mongoose) ;

export async function getBookService(bookId:ObjectId):Promise<IBookModel> {
  return await Book.findOne({_id:bookId}).exec();
}

export async function addBookService(clientId:ObjectId, book:IBook):Promise<IBook> {
   let bookToSave = new Book(book);
   delete bookToSave.alias ;
   const result=bookValidate(bookToSave) ;
   if (result===null) {
      bookToSave=await bookToSave.save() ;
      let owner:IOwners = {
         clientId:clientId,
         bookId: bookToSave._id,
         alias: book.alias 
      }
      const oresult=ownerValidate(owner) ;
      if (oresult===null) {
          let ownerToSave=new Owner(owner)
          return  bookToSave;
      }
      else 
         throw new Error(oresult) ;
   }
   else 
      throw new Error(result) ;
}