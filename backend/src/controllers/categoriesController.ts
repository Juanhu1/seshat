
import { getCategoriesService, getAllCategoriesService, addNewCategories } from  '../services/categoriesServices' ;
import { ICategoriestModel } from '../models/categories';

export async function getCategories(catname):Promise<ICategoriestModel> {
  return await getCategoriesService(catname);  
}

export async function getAllCategories():Promise<ICategoriestModel[]> {
    console.log("CategoriecsController") ;
   return await getAllCategoriesService() ;
}

export async function addCategories( userToAdd):Promise<ICategoriestModel> {
   const client:ICategoriestModel=await getCategoriesService(userToAdd.name)
   if (client) {
      throw new Error('Categories already registered.');
   } else {
      return await addNewCategories(userToAdd) ;
   }
}