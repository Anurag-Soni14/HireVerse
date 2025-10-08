import express from 'express';
import { createJob, deleteJob, getJob, listApplicants, listJobs, listMyJobs, updateJob } from '../controllers/jobController.js';
import auth from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/',auth, authorizeRoles("candidate"), listJobs);

router.get('/my',auth, authorizeRoles("recruiter"), listMyJobs);

router.get('/:id', getJob);

router.post('/', auth, authorizeRoles("recruiter"), createJob);

router.put('/:id', auth, authorizeRoles("recruiter"), updateJob);

router.delete('/:id', auth, authorizeRoles("recruiter"), deleteJob);

router.get('/:id/applicants', auth, authorizeRoles("recruiter"), listApplicants);

export default router;


