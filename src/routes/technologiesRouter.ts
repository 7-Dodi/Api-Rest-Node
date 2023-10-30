const express = require('express');
const userRouter = express.Router();
import {listTechnologies, addTechnologies, updateStudied, updateTechnologies, deleteTechnologies} from '../controllers/technologiesController';
import { checkExistsUserAccount } from '../middleware/checkExistsUserAccount'; //Importando o Middleware

//Métodos de Technologies:
userRouter.get('/', checkExistsUserAccount, listTechnologies);
userRouter.post('/', checkExistsUserAccount, addTechnologies);
userRouter.put('/:id', checkExistsUserAccount, updateTechnologies);
userRouter.patch('/:id/studied', checkExistsUserAccount, updateStudied);
userRouter.delete('/:id', checkExistsUserAccount, deleteTechnologies);

export {userRouter}; 