import dotenv from 'dotenv';
import express from 'express';
import {connectDB} from './utils/db.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
// routes
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import candidateRoutes from './routes/candidates.js';
import recruiterRoutes from './routes/recruiters.js';
import messageRoutes from './routes/messages.js';
import dashboardRoutes from './routes/dashboard.js';
import path from 'path';
import { fileURLToPath } from 'url';



dotenv.config();
const app = express();
connectDB();

const corsOption = {
    origin: "http://localhost:5173",  
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
};

app.use(helmet());
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ ES module way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));