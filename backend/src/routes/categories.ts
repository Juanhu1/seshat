import * as auth from '../middleware/auth' ;
import * as Express from "express" ;
const _ = require('lodash');
let router = Express.Router(); 

import {getCategories, getAllCategories, addCategories} from '../controllers/categoriesController' ;

const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'Failed' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};

router.get('/:catname', controllerHandler(getCategories,    (req, res, next) => [req.params.categoriesName]));
router.get('/',         controllerHandler(getAllCategories, (req, res, next) => [])) ;

router.post('/', async (req, res, next) => {
  try {
      res.send(await addCategories(  _.pick(req.body, ['name', 'limitation']))) ;
  } catch (error) {
     return res.status(500) && next(error);
  }
} ) ;

module.exports = router; 