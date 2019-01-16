
import {Owner, IOwnerModel, validate} from '../models/owners'; 
import { ObjectID, ObjectId } from 'bson';

export async function getOwnerService(ownerRecordId:ObjectId):Promise<IOwnerModel> {
  return await Owner.findOne({ownerRecordId:ObjectId}).exec();
}

export async function getClientAllBookService(cid:ObjectId):Promise<IOwnerModel[]> {    
  return Owner.find({clientId: cid}).sort('name');
}

export async function addOwnerRecord(ownerRec:IOwnerModel):Promise<IOwnerModel> {
   let ownerToSave = new Owner(ownerRec);
   const result=validate(ownerToSave) ;
   if (result===null) 
      return await ownerToSave.save();
   else 
      throw new Error(result) ;
}