import * as auth from '../middleware/auth' ;
import * as Express from "express" ;
import * as _ from "lodash" ;
//const _ = require('lodash');
let router = Express.Router(); 

import {getBooks, createBook } from '../controllers/bookController' ;

const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'Failed' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};

router.get('/',         controllerHandler(getBooks, (req, res, next) => [])) ;

router.post('/', async (req, res, next) => {
  try {
      res.send(await createBook( req.body.clientId, _.pick(req.body, ['title', 'visible', 'shared', 'useSnowFlake','language','price', 'currency','password', 'alias']))) ;
  } catch (error) {
     return res.status(500) && next(error);
  }
} ) ;

module.exports = router; 