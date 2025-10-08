import express from 'express';
import { getMessagesForCandidate, markAsRead, sendMessage } from '../controllers/messageController.js';
import auth from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/send', auth, authorizeRoles("recruiter"), sendMessage);

router.get("/", auth, authorizeRoles("candidate"), getMessagesForCandidate);

router.put("/read/:id", auth, authorizeRoles("candidate"), markAsRead);

export default router;


