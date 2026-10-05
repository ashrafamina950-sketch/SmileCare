# SmileCare Dental (MERN + Tailwind)

Complete dental clinic website: public site, REST API and admin panel.

- **Frontend:** React 18, Vite, React Router, Tailwind CSS 3
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Admin panel:** `/admin` (same React app)

## Requirements
- Node.js 18+
- MongoDB running locally, or a free MongoDB Atlas connection string

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD
npm run seed              # FIRST TIME ONLY: admin user + sample services, doctors, reviews
npm run dev               # API on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev               # site on http://localhost:5173
```
Vite proxies `/api` to `localhost:5000`, so no extra config is needed in development.

### 3. Admin panel
Open http://localhost:5173/admin/login. You can sign in with **either your email or your phone number** plus the password
from your `.env` (`ADMIN_EMAIL` / `ADMIN_PHONE` / `ADMIN_PASSWORD`). Phone numbers match however they are typed
(`0300 1234567`, `+92 300 1234567`). **Change the password before going live** (Admin > Settings).

Already ran `npm run seed` before and have your own data? Do **not** seed again (it resets services, doctors and reviews).
Use `npm run create-admin` instead: it only creates/updates the admin login. Or just add your phone in Admin > Settings.

There is no sign up or login for patients. Only the admin logs in.

## Pages

| Public | Admin |
|---|---|
| `/` Home | `/admin` Dashboard (today, pending, totals) |
| `/services`, `/services/:slug` | `/admin/appointments` approve, cancel, complete, reschedule, delete |
| `/doctors`, `/doctors/:slug` | `/admin/doctors` add, edit, delete |
| `/reviews` (+ submit a review) | `/admin/services` add, edit, delete |
| `/about`, `/contact` | `/admin/reviews` approve patient reviews, add, delete |
| `/book` appointment booking | `/admin/messages` read contact messages |
| | `/admin/settings` clinic info, Google Map, payments, admin login details |

Double booking is prevented: a doctor's time slot that is already pending/approved cannot be booked again.
New patient reviews stay hidden until an admin approves them.

## Google Map
Admin > Settings > Google Map:
- **Google Maps link** (any share link, `maps.app.goo.gl/...` works): used for the "Open in Google Maps" and "Get directions" buttons.
- **Map embed** (optional): Google Maps > Share > Embed a map > Copy HTML, paste it in. This shows the exact pin.
  If left empty, the map is searched from the clinic address automatically.

The map appears on Home, Contact and in the footer link.

## Payments (Easypaisa, JazzCash, bank transfer)
These are **manual** local payments, no payment gateway or fees:
1. In Admin > Settings > Payments set the consultation fee, turn on the methods you use and enter your account details.
   All methods are off by default, so no wrong account is ever shown to patients.
2. On the booking page the patient sees the fee and your account (with Copy buttons), sends the money from their app,
   and enters the **Transaction ID**, sender name and number.
3. In Admin > Appointments you see the payment (method, TID, sender). Check it against your Easypaisa/JazzCash/bank
   statement, then press **Payment received** or **Reject payment**.
- "Fee must be submitted to book" makes the payment step compulsory. "Pay at clinic" lets patients pay on the visit.
- The fee is always read from the server, and a transaction ID cannot be used for two appointments.

## WhatsApp
- Admin > Appointments has a **WhatsApp** button on every appointment. It opens WhatsApp to the patient's number with a ready
  message (doctor, date, time, service, address and map link). You press send from the clinic's WhatsApp.
- If you enter the clinic WhatsApp number in Settings, the booking confirmation page shows a "Message us on WhatsApp" button.
- Messages are **not sent automatically**. Fully automatic messages need the WhatsApp Business Cloud API (Meta business account
  approval, may cost per message). It can be added later in `server/routes/appointments.js`.
- Local numbers starting with 0 are treated as Pakistan (+92).

## API overview
- `POST /api/auth/login` (`identifier` = email or phone, `password`), `GET /api/auth/me`, `PUT /api/auth/profile`, `PUT /api/auth/password`
- `GET /api/settings` (public), `PUT /api/settings` (admin)
- `GET /api/services`, `GET /api/doctors`, `GET /api/reviews` (public); `POST/PUT/DELETE` need the admin token
- `POST /api/appointments`, `GET /api/appointments/slots?doctor=&date=` (public); the rest is admin only
- `POST /api/messages` (public); read/manage is admin only
- `POST /api/reviews/submit` (public, saved as pending)

## Deploying
1. **Database:** create a MongoDB Atlas cluster and use its URI as `MONGO_URI`.
2. **Backend:** deploy `server/` to Render/Railway. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL) and run `npm run seed` once.
3. **Frontend:** deploy `client/` to Vercel/Netlify with the env var `VITE_API_URL=https://your-api-url/api`. Add a rewrite of all routes to `/index.html` so React Router works on refresh.

## Notes
- Doctor photos use Unsplash URLs as placeholders; replace them from the admin panel with your own photo links.
- Address, phone, email and map are edited in Admin > Settings. Opening hours are still text in `Layout.jsx`, `Home.jsx` and `Contact.jsx`.
- Admin login is limited to 10 attempts per 15 minutes per IP.
- Email notifications are not included yet; they can be added in `server/routes/appointments.js` with Nodemailer.
