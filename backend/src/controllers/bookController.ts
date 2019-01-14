import { getOwnerService, getClientAllBookService, addOwnerRecord } from  '../services/ownerServices' ;
import { ICategoriestModel } from '../models/categories';
import { ObjectId } from 'bson';
import { IOwnerModel } from '../models/owners';
import { getBookService, addBookService } from '../services/bookServices' ;
import { IBook } from '../models/books' ;
const _ = require('lodash');
 
export async function getBooks(clientId:ObjectId):Promise<IBook[]> {
  let books:IBook[] = [] ;  
  const clientBooks:IOwnerModel[] =  await getClientAllBookService(clientId);  
  _.forEach(clientBooks, async (clientBook:IOwnerModel) => {
       let book:IBook=await getBookService(clientBook.bookId) ;
       book.alias=clientBook.alias ;
       books.push(book) ;
  })
  return books ;
}

/*

export async function addBook( userToAdd):Promise<ICategoriestModel> {
   const client:ICategoriestModel=await getCategoriesService(userToAdd.name)
   if (client) {
      throw new Error('Categories already registered.');
   } else {
      return await addNewCategories(userToAdd) ;
   }
} */