import express from 'express';
import { userController } from '../controller/userController.js';
import { Auth } from '../middleWare/Auth.js';


const router = express.Router();


router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/', Auth, userController.searchUser);

export const userRoutes = router;