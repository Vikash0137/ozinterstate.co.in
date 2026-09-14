# STEP 4 — CUSTOMERS MODULE Status

Summary
- Backend: `Customer` Mongoose model, controller (`controllers/customerController.js`), and routes (`routes/customerRoutes.js`) added and mounted at `/api/customers`. Routes are protected by `verifyAdmin` middleware.
- Frontend (oz-admin): `src/services/customerService.js` plus pages: `CustomersPage.jsx`, `CustomerFormPage.jsx`, `CustomerDetailsPage.jsx`, `CustomerEditPage.jsx`. Sidebar and routing wired in `src/routes/AppRoutes.jsx`.
- Dashboard: backend dashboard stats extended to include `total_customers` and `active_customers`; admin dashboard fetches `/api/dashboard/stats` and displays counts.

Tests
- Added lightweight backend test: `oz-backend/tests/customers.test.js` (connects via `config/db.js` and runs create/read/update/search/pagination/soft-delete + cleanup).
- Test run result (local): `All customer tests passed.`

How to verify locally
1. Ensure MongoDB is running and reachable at `MONGODB_URI` (default `mongodb://127.0.0.1:27017/oz_interstate`).
2. Run backend dev server:

   cd oz-backend
   npm run dev

3. (Optional) Run backend tests:

   node tests/customers.test.js

4. Start admin UI:

   cd oz-admin
   npm run dev

5. In admin UI (login required), open: `/customers` (list), `/customers/new` (create), click a row to view details and edit.

Notes & remaining work
- Frontend integration tests are not implemented (manual verification possible via UI).
- If admin login fails, seed the admin user after Mongo is available: in `oz-backend` run `npm run seed:admin` (seed requires Mongo connection). If seeding is skipped, you may create an admin document directly in Mongo.

Conclusion
- STEP 4 (Customers module) is implemented and backend tests pass. Remaining items: add automated frontend integration tests and any UX polishing you want.
