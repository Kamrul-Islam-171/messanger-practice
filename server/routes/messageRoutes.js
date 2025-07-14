import express from 'express';

import { Auth } from '../middleWare/Auth.js';
import { sendMessageController } from '../controller/sendMessageController.js';



const router = express.Router();

router.post('/', Auth, sendMessageController.sendMessage);

//fetching all messages for a particular chat
router.get('/:chatId', Auth, sendMessageController.allMessages);

export const messageRoutes = router;