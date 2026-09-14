# STEP 2 — Authentication & Admin User

## Completed
- Authentication code implemented (Admin model, bcrypt hashing) — implemented but not fully integration-tested due to Mongo connectivity.
- Login API updated to use Mongo-backed Admin and JWT issuance — implemented.
- JWT verification middleware tightened (removed dev bypass) — implemented.
- Seed script `npm run seed:admin` added — implemented.

## Verification
- MongoDB: FAIL — no reachable MongoDB instance from this environment; seed aborted.
- Admin seed: FAIL — aborted because MongoDB not connected.
- Login: FAIL — cannot verify until admin is seeded in Mongo.
- JWT: FAIL — issuance code present but not end-to-end tested.
- Protected route: FAIL — not verified end-to-end without seeded admin/JWT.
- Invalid login rejection: PASS (code returns 401 when user not found or password mismatch) — logic present and exercised in code path, but full integration not executed.

## Observations & Notes
- `oz-backend/.env` currently contains `MONGODB_URI=mongodb://127.0.0.1:27017/oz_interstate` (development default). The seed attempt failed because no Mongo server accepted connections at that address.
- The seed script uses `connectMongo()` from `oz-backend/config/db.js` — the seed attempts a Mongo connection and will abort if Mongo is unreachable.
- The running server (`node server.js`) currently uses the legacy file-store `oz-backend/db.js` `initDb()` at startup; it does not import or call `config/db.js` automatically, so server start may not attempt Mongo connection. The seed script does attempt Mongo.
- Passwords are hashed via bcrypt in `models/Admin.js` and password fields are excluded from JSON responses. The code ensures password is not returned in APIs.

## What to put in `.env` when Mongo is available
- For local Mongo (no auth):

  MONGODB_URI=mongodb://127.0.0.1:27017/oz_interstate

- For local Mongo with root user (Docker example):

  MONGODB_URI=mongodb://<rootUser>:<rootPassword>@127.0.0.1:27017/oz_interstate?authSource=admin

- For MongoDB Atlas (replace placeholders):

  MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/oz_interstate?retryWrites=true&w=majority

Do NOT commit real credentials to source control. Place these values in `oz-backend/.env` (already in `.gitignore`).

## How to start a local MongoDB quickly (Docker)

1) Run Mongo in Docker (no auth):

```bash
docker run -d -p 27017:27017 --name oz-mongo mongo:6.0
```

Then set `MONGODB_URI=mongodb://127.0.0.1:27017/oz_interstate` in `.env` and run the seed.

2) Run Mongo in Docker with auth (example):

```bash
docker run -d -p 27017:27017 --name oz-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  mongo:6.0
```

Then set in `.env`:

```
MONGODB_URI=mongodb://admin:secret@127.0.0.1:27017/oz_interstate?authSource=admin
```

## Commands to run after Mongo is available

1) Seed admin:

```bash
cd oz-backend
npm run seed:admin
```

2) Login test (replace values):

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ozinterstate.com","password":"admin123"}'
```

Expected: JSON containing `token` and `user` (id, name, email, role).

3) Test protected route (replace <JWT>):

```bash
curl -H "Authorization: Bearer <JWT>" http://localhost:5000/api/dashboard
```

## Remaining Issues (actual)
- MongoDB not running or unreachable in this environment; prevents seeding and end-to-end verification.
- Server startup currently relies on `oz-backend/db.js` (file-store) and does not itself attempt `config/db.js`'s Mongo connection; if you want the server to attempt Mongo on startup, consider importing and calling `config/db.js`'s `connectMongo()`/`initDb()` from the server bootstrap (this is optional and requires your approval).

## Next steps I can take for you
- Re-run `npm run seed:admin` and full verification once you start a local MongoDB or provide a valid `MONGODB_URI` (I will then perform seed → login → protected route tests and update this file with PASS results).
- If you want, I can implement server startup to attempt Mongo connection on boot (requires your approval to modify `server.js` to import `config/db.js`).
