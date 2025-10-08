import express from 'express';
import { getCandidate, getProfile, searchCandidates, updateCandidateProfile } from '../controllers/candidateController.js';
import auth from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', auth, authorizeRoles("recruiter"), searchCandidates);

router.get('/profile', auth, authorizeRoles("candidate"), getProfile);

router.get('/:id', auth, authorizeRoles("recruiter"), getCandidate);

router.put("/update-profile", auth, authorizeRoles("candidate"), upload.single("resume"), updateCandidateProfile);

export default router;


