 BookIt: Experiences & Slots

BookIt is a full-stack booking platform that allows users to explore travel experiences, view available slots, apply promo codes, and confirm bookings securely — all built with React + TypeScript, Node.js + Express, and MongoDB.

 Live Demo

Frontend (Vercel): https://bookit.vercel.app
Backend (Render): https://bookit-api.onrender.com

Features
1.Frontend
Browse and view experiences with dynamic data
View available date/time slots per experience
Prevent booking of full or duplicate slots
Apply promo codes (SAVE10, FLAT100)
Auto price calculation with tax & discount
Checkout form with validation (name, email, terms)
Responsive UI for desktop & mobile
Booking confirmation screen with Ref ID

2.Backend
RESTful API endpoints for:
a.Experiences (/api/experiences)
b.Bookings (/api/bookings)
c.Promo codes (/api/promo)
MongoDB persistence with seeding
Prevent double-booking for same slot
Auto update of slot capacity after booking
Comprehensive error handling

Project Strucutre 
Frontend

src/
 ├─ components/
 │   └─ Navbar.tsx
 ├─ pages/
 │   ├─ Home.tsx
 │   ├─ Experiences.tsx
 │   ├─ ExperienceDetails.tsx
 │   ├─ Checkout.tsx
 │   ├─ Confirmation.tsx
 ├─ services/
 │   └─ api.ts
 ├─ App.tsx
 └─ main.tsx


Backend

src/
 ├─ index.ts
 ├─ models/
 │   ├─ Experience.ts
 │   └─ bookingModel.ts
 ├─ routes/
 │   ├─ experiences.ts
 │   ├─ bookings.ts
 │   └─ promo.ts


Setup & Run Locally
git clone 
cd bookit

Backend Setup
cd backend
npm install

Create a .env file inside /backend with:
PORT=5000
MONGODB_URI=mongodb+srv://rmrisbitw_db_user:mxoi32nxsPTqUHBw@bookit.dafmsde.mongodb.net/?appName=Bookit

To run backend
npm run dev

Frontend Setup
cd frontend
npm install

Create a .env file inside /frontend with:
VITE_API_URL=http://localhost:5000/api

Then run 
npm run dev




