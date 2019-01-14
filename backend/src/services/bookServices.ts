
import {Book, IBookModel} from '../models/books'; 
import { ObjectID, ObjectId } from 'bson';

export async function getBookService(bookId:ObjectId):Promise<IBookModel> {
  return await Book.findOne({_id:bookId}).exec();
}

export async function addBookService(book:IBookModel):Promise<IBookModel> {
   let bookToSave = new Book(book);
   return await bookToSave.save();
}