import express from 'express';
import { applyToJob, getApplicants, listApplications, updateStatus, withdraw } from '../controllers/applicationController.js';
import auth from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', auth, authorizeRoles("candidate"), listApplications);

router.post('/apply', auth, authorizeRoles("candidate"), applyToJob);

router.put('/:id/status', auth, authorizeRoles("recruiter"), updateStatus);


router.get('/get-applicants/:id', auth, authorizeRoles("recruiter"), getApplicants);

router.delete('/:id', auth, authorizeRoles("candidate"), withdraw);

export default router;


