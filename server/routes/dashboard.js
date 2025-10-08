import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getCandidateDashboard, getRecruiterDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/candidate', auth, authorizeRoles('candidate'), getCandidateDashboard);

router.get('/recruiter', auth, authorizeRoles('recruiter'), getRecruiterDashboard);

export default router;


