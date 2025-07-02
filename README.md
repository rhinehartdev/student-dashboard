# 🎓 Student Dashboard Web App

A modern student dashboard for managing academic performance — built with **React**, **Tailwind CSS**, **MySQL**, and **Node.js**. This full-stack application supports student record management, status tracking (Passed, Conditional, At Risk), data filtering, Excel export, and light/dark mode UI.

> 🚀 Live Demo: _[Your Live Link Here]_  
> 📦 Backend Repo: _[Backend GitHub Repo Link Here]_  
> 🌐 Frontend Repo: _[Frontend GitHub Repo Link Here]_

---

## 📸 Features

- 🔍 Search, filter, and edit student records  
- 📊 Interactive dashboard with chart summaries  
- 🌒 Light & Dark mode UI  
- 📦 Export filtered reports to Excel  
- ⏰ Real-time clock display  
- 🧪 Toast notifications and loading spinners  
- 💻 Fully responsive design  

---

## 🛠 Tech Stack

**Frontend:**
- React + Vite  
- Tailwind CSS  
- Recharts  
- Axios  
- React CountUp  
- React Toastify  

**Backend:**
- Node.js + Express  
- MySQL (local or cloud like Planetscale/Railway)  
- CORS, dotenv, body-parser  

---

## 🔧 Setup Instructions

### 1. Clone the Repositories

```bash
git clone https://github.com/your-username/student-dashboard-frontend.git
git clone https://github.com/your-username/student-dashboard-backend.git
```

Frontend Setup
cd student-dashboard-frontend
npm install
npm run dev

Backend Setup
cd ../student-dashboard-backend
npm install

Create a .env file:

env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=studentdb

Start the backend:

bash
node index.js

MySQL Table Setup
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  section VARCHAR(255),
  grade FLOAT,
  status ENUM('Passed', 'Conditional', 'At Risk')
);

🚀 Deployment
Frontend (Netlify or Vercel)
Push frontend to GitHub

Import the repository into Netlify or Vercel

Set the build command to npm run build and output directory to dist

Make sure all Axios requests point to the deployed backend URL

Backend (Render or Railway)
Push backend to GitHub

Import the repo to Render or Railway

Set environment variables from your .env

Link to Planetscale or MySQL server

Deploy as a web service
```
🗂 Folder Structure
student-dashboard/
├── backend/
│   └── index.js
│   └── db.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── App.jsx
🧪 Future Improvements
 Add user authentication

 Import/export via CSV

 Printable PDF reports

 Table pagination and sorting
 Role-based access (Admin/Teacher)
```

👨‍💻 Author
Made with ❤️ by Rhinehart Dejucos
