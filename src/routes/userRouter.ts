const express = require('express');
const userRouter = express.Router();
import {listUser, addUser} from '../controllers/userController';

//Métodos do usuário:
userRouter.get('/', listUser);
userRouter.post('/', addUser);

export {userRouter};