
import {Client, IClientModel} from '../models/clients'; 
const bcrypt = require('bcrypt');

export async function getClientService(username) {
  const result: IClientModel = await Client.findOne({name:username}).exec();
  return result ;
}

export function getAllClientService() {
  return Client.find().sort('name');
}

export async function addNewClientAndReturnAuthTokenService(client:IClientModel) {
   const salt = await bcrypt.genSalt(10);
   client.password = await bcrypt.hash(client.password, salt);
   let clientToSave = new Client(client);
   await clientToSave.save();
   return clientToSave.generateAuthToken();
}