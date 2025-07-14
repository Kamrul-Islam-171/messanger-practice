import express from 'express';
import { chatController } from '../controller/chatController.js';
import { Auth } from '../middleWare/Auth.js';



const router = express.Router();


router.post('/', Auth, chatController.accessChat);
router.post('/group', Auth, chatController.createGroupChat);
router.patch('/rename', Auth, chatController.renameGroupChat);
router.patch('/addToGroup', Auth, chatController.addToGroup);
router.delete('/removeFromGroup', Auth, chatController.removeFromGroup);
router.get('/', Auth, chatController.fetchChats);

export const chatRoutes = router;