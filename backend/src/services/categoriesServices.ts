
import {Categories, ICategoriestModel, validate} from '../models/categories'; 

export async function getCategoriesService(username):Promise<ICategoriestModel> {
  return await Categories.findOne({name:username}).exec();
}

export async function getAllCategoriesService():Promise<ICategoriestModel[]> {    
  return Categories.find().sort('name');
}

export async function addNewCategories(cat:ICategoriestModel):Promise<ICategoriestModel> {
   let categoriesToSave = new Categories(cat);
   const result=validate(categoriesToSave) ;
   if (result===null ) 
      return await categoriesToSave.save();
   else
      throw new Error(result) ;
}