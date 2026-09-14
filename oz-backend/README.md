# OZ Interstate Movers Backend API

Production-ready Node.js & Express RESTful API server for OZ Interstate Movers website and Admin Panel.

## Features
- **Architecture**: Express.js, Node.js ES Modules, Modular MVC architecture.
- **Database**: MySQL Database schema (`database/schema.sql`) covering 23 tables (`admins`, `roles`, `permissions`, `banners`, `categories`, `services`, `blogs`, `gallery`, `testimonials`, `faqs`, `about`, `seo`, `settings`, `contact_details`, `social_links`, `inquiry_forms`, `inquiry_fields`, `inquiry_responses`, `media_library`, `activity_logs`, `login_logs`, `password_resets`).
- **Security**: JWT Authentication, Bcrypt password hashing, Helmet security headers, CORS origin protection, Rate Limiting, Input Sanitization (XSS & SQL Injection protection).
- **Media Uploads**: Multer uploader handling Images (`uploads/images`), Videos (`uploads/videos`), and Documents (`uploads/documents`) up to 100MB with MIME type validation.
- **Logging**: Morgan HTTP logger and Activity loggers.
- **API Modules**: Full CRUD APIs for Admin Auth, Dashboard Stats, Banner Management (Image & Video banners), Dynamic Inquiry Form Builder, Inquiry Responses, Media Library, Categories, Services, About, Blogs, Gallery, Testimonials, FAQs, SEO, Settings, and Users.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd oz-backend
   npm install
   ```

2. **Database Import**:
   Import `database/schema.sql` into your MySQL instance:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

4. **API Base URL**: `http://localhost:5000/api`
