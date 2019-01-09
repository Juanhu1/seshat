
import { getClientService } from  '../services/clientServices' ;

export async function getUser(username) {
  const client = await getClientService(username);
  return client;
}