 BookIt: Experiences & Slots

BookIt is a full-stack booking platform that allows users to explore travel experiences, view available slots, apply promo codes, and confirm bookings securely — all built with React + TypeScript, Node.js + Express, and MongoDB.

 Live Demo

Frontend (Vercel): https://bookitdeployed.vercel.app/
Backend (Railway): https://bookit-production-e0a1.up.railway.app/

Features
1.Frontend
ChatGPT said:The Bookit web app allows users to seamlessly browse and view travel experiences with fully dynamic data, exploring each experience’s available date and time slots in real time. It intelligently prevents users from booking slots that are already full or duplicate entries for the same experience. Users can apply promo codes like SAVE10 or FLAT100 to unlock instant discounts, with automatic price recalculation that includes taxes and applied discounts. The checkout process features a clean, validated form requiring essential details such as name, email, and acceptance of terms before completing the booking. Once confirmed, users receive a booking confirmation screen displaying a unique Reference ID for their reservation. The entire interface is designed with a responsive UI, ensuring a smooth and optimized experience across both desktop and mobile devices.

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




