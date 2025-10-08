import express from 'express';
import { getRecruiterProfile, updateRecruiter } from '../controllers/recruiterController.js';
import auth from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/profile', auth, authorizeRoles("recruiter"), getRecruiterProfile);

router.put('/:id', auth, authorizeRoles("recruiter"), updateRecruiter);

export default router;


