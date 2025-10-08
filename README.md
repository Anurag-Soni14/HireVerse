# HireVerse - MERN Stack Job Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Project Overview

HireVerse is a full-stack job portal web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows:

* **Candidates** to register, create profiles, upload resumes, browse jobs, apply, and track applications.
* **Recruiters** to register, post jobs, search for candidates, and track applicants.

The project aims to connect job seekers and recruiters efficiently with a modern web interface.

## Features

### Candidate Features

* Authentication (Signup/Login)
* Profile & Portfolio Management (Add personal details, skills, resume, portfolio links)
* Job Applications (Browse jobs, apply, track status)
* Dashboard with analytics (Skills vs Applied Jobs, Success Rate, etc.)

### Recruiter Features

* Authentication (Signup/Login)
* Job Posting (Create, Edit, Delete jobs)
* Candidate Search & Filtering (Skills, Experience, Keywords)
* Dashboard with analytics (Applicants per job, Skill Match, Activity Metrics)

### Common Features

* Responsive design for mobile and desktop
* File upload for resumes
* Messaging system between recruiters and candidates

## Technologies Used

* **Frontend:** React.js, Tailwind CSS, Lucide Icons, React-Quill (Rich Text Editor)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT, Cookies
* **State Management:** React Context API
* **Others:** Axios, Sonner (toast notifications), React Router

## Installation & Setup

### Prerequisites

* Node.js >= 18
* MongoDB installed or MongoDB Atlas account

### Clone Repository

```bash
git clone https://github.com/Anurag-Soni14/HireVerse.git
cd HireVerse
```

### Backend Setup

* Create a .env file in /server folder
* Add these variable value:
    * PORT=5000
    * MONGO_URI=your_mongodb_connection_string
    * JWT_SECRET=your_JWT_secret_key
    * JWT_EXPIRES_IN=7d
    * NODE_ENV=development

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Your application should now be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Project Structure

```
HireVerse/
├─ server/                # Backend
│  ├─ controllers/        # Express controllers
│  ├─ models/             # Mongoose models
│  ├─ routes/             # API routes
│  ├─ middleware/         # Auth, error handling, etc.
│  └─ server.js           # Main server file

├─ client/                # Frontend
│  ├─ src/
│  │  ├─ components/      # Reusable React components
│  │  ├─ contexts/        # Context API providers
│  │  ├─ pages/           # Route pages
│  │  ├─ hooks/           # Custom React hooks
│  │  ├─ utils/           # Helper functions
│  │  └─ App.jsx
└─ README.md
```

## Demo Video

Watch the demo video showcasing the project: [Demo Video](https://drive.google.com/file/d/your-demo-link)

## Screenshots

### Landing Page

<img width="1905" height="1712" alt="localhost_5173_" src="https://github.com/user-attachments/assets/80f33612-009f-4404-9658-ba7d2dfd0ca9" />

### Auth  Page

<img width="1905" height="662" alt="localhost_5173_auth" src="https://github.com/user-attachments/assets/fc8baa8f-5d53-4ded-a3ca-27dd7717191f" />

### Candidate Dashboard

<img width="1905" height="963" alt="localhost_5173_auth (1)" src="https://github.com/user-attachments/assets/6aa4aa23-949f-47c2-87a7-08f8f1979f3b" />

### Recruiter Dashboard

<img width="1905" height="1027" alt="localhost_5173_auth (2)" src="https://github.com/user-attachments/assets/1de6f263-c72e-4a71-81a5-428490a3cbf1" />

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Anurag Soni** - [GitHub](https://github.com/Anurag-Soni14)
