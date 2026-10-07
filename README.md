# 🚀 OpsPilot AI - Operational Command & AI Incident Dispatch Platform

OpsPilot AI (also known as OpsCommand AI) is a next-generation, AI-powered emergency management and decision-support platform. Designed for emergency dispatch centers, disaster response teams, and operational commanders, it transforms raw, unstructured incident reports into structured JSON response plans, automated task lists, resource allocations, and executive command reports using Google Gemini.

---

## 🌟 Key Features

- 🧠 **Google Gemini AI Incident Parsing**: Parses unstructured operational incident text into structured JSON containing severity, category, step-by-step action plans, required resource lists, and risk impact assessments.
- ⚡ **Automated Workflow Orchestration**: Upon incident submission, OpsPilot automatically:
  1. Stores the incident with AI assessment.
  2. Auto-creates operational response tasks.
  3. Auto-reserves and assigns matching field resources (e.g., Response Teams, Medical Units, Transports).
  4. Records real-time entries into the System Activity Log.
- 📄 **Executive Situational Briefings**: One-click AI Command Report generation summarizing operational status, resource allocations, and next steps for leadership briefing.
- 📊 **Real-time Command Dashboard**: High-tech, dark-mode command center UI with key metrics, severity distribution, status tracking, critical alerts feed, and live system activity log.
- 🛡️ **Graceful Live Demo Fallback**: Built-in fallback mechanism ensuring zero downtime or UI breakage even without an active Google Gemini API key or during network drops.
- 🔒 **Role-Based Authentication**: Secure JWT-based access with quick "Demo Login" options for Operations Managers and Field Officers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Custom Dark Command Center Palette
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT Interceptor

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose) with automatic `mongodb-memory-server` fallback
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **AI Integration**: Google Gemini API (`@google/genai` with REST API & local fallback logic)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
cd opspilot-ai
npm run install-all
```

### 2. Environment Configuration
Backend `.env` file (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/opspilot
JWT_SECRET=opspilot_hackathon_super_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

Frontend `.env` file (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Application
```bash
# Start backend and frontend simultaneously
npm run dev
```
- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Demo Login Credentials

You can use the built-in quick login buttons on the Login page or use these credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Operations Manager** | `manager@opspilot.ai` | `password123` |
| **Field Officer** | `officer@opspilot.ai` | `password123` |

---

## ⚡ Live Demo Walkthrough (SIH Snowfall Scenario)

1. Log in using **"Demo Login as Manager"**.
2. Click **Report Incident** in the sidebar.
3. Click the **"⚡ Auto-Fill SIH Demo Scenario"** button to load:
   - **Title**: Snowfall Blocking Patrol Route B
   - **Location**: Sector 4 - Patrol Route B
   - **Type**: Environmental / Emergency
   - **Description**: Heavy snowfall has blocked Patrol Route B. Two personnel are stranded and the nearest available response team is 18 km away.
4. Click **Submit & Run AI Assessment**.
5. Observe the high-tech AI processing animation as OpsPilot parses the report, creates tasks, reserves resources, and logs system actions.
6. Click into the **Incident Details** view to inspect side-by-side AI assessment, recommended steps, assigned resources, and click **Generate AI Command Report**.

---

© 2026 OpsPilot AI Team. All rights reserved.
