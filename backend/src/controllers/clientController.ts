
import { getClientService, getAllClientService, addNewClientAndReturnAuthTokenService } from  '../services/clientServices' ;
import { IClientModel} from '../models/clients'; 
const _ = require('lodash');

export async function getUser(username) {
  const client = await getClientService(username);
  return client;
}

export async function getAllUser() {
   return await getAllClientService() ;
}

export async function addUser( userToAdd) {
   const client:IClientModel=await getClientService(userToAdd.name)
   if (client) {
      throw new Error('Client already registered.');
   } else {
      return await addNewClientAndReturnAuthTokenService(userToAdd) ;
      //res.header('x-auth-token', token).send(_.pick(userToAdd, ['_id', 'name', 'email']));
   }
}