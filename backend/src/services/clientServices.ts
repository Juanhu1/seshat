
import {Client} from '../models/clients'; 

export function getClientService(username) {
  return Client.find({name:username}).exec();
}