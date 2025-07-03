# 🎓 Student Dashboard Web App

A modern student dashboard for managing academic performance — built with **React**, **Tailwind CSS**, and **Firebase**. It supports student record management, filtering, data visualization, Excel export, and light/dark mode UI.

> 🚀 **Live Demo**: [https://student-dashboard-liard.vercel.app/](https://student-dashboard-liard.vercel.app/)

---

## 📸 Features

- 🔍 Add, edit, delete, and search student records  
- 📊 Dashboard with charts and stats  
- 🌗 Light/Dark mode  
- 📤 Export reports to Excel  
- ⏰ Real-time clock  
- 🧁 Toast notifications and spinners  
- 💻 Fully responsive UI

---

## 🛠 Tech Stack

- **React + Vite**
- **Tailwind CSS**
- **Firebase Firestore** (NoSQL DB)
- **Recharts**, **React CountUp**, **React Toastify**
- **xlsx** for Excel export

---

## 🔧 Setup

### 1. Clone the repo

```bash
git clone https://github.com/rhinehartdev/student-dashboard.git
cd student-dashboard
npm install
npm run dev
```

Create src/firebase.js:
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

🧪 Future Improvements
🔐 Auth (Admin login)

📥 Import via CSV

🖨️ PDF export

📄 Table pagination/sorting

🎓 Role-based access (Admin/Teacher)

Made by Rhinehart Dejucos
