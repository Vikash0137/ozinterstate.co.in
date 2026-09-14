# OZ Interstate Website - Pages and Sections Overview

Yeh document OZ Interstate (`oz`) website ke sabhi **Pages (Routes)** aur **Sections / Components** ka complete breakdown provide karta hai.

---

## 📑 1. Total Pages (Routes) Summary

Website mein total **10 Pages (Routes)** configure kiye gaye hain:

| # | Page Name | File Path | Route / URL | Main Purpose |
|---|---|---|---|---|
| 1 | **Home Page** | `oz/src/pages/Home.jsx` | `/` | Main landing page jismein sabhi key services, stats, reviews, gallery aur quote form hai. |
| 2 | **Company Profile** | `oz/src/pages/CompanyProfile.jsx` | `/company-profile` | About Us page jismein company story, mission, vision, values aur team members hain. |
| 3 | **Our Services** | `oz/src/pages/Services.jsx` | `/services` | Sabhi relocation services, included features, workflow process aur FAQs. |
| 4 | **Reviews & Testimonials** | `oz/src/pages/ReviewsPage.jsx` | `/reviews` | Customer ratings, 4.9★ rating breakdown bars aur all customer reviews. |
| 5 | **Our Blogs** | `oz/src/pages/Blogs.jsx` | `/blogs` | Featured moving article aur latest packing & moving guides. |
| 6 | **Locations Listing** | `oz/src/pages/Locations.jsx` | `/locations` | Australia ke saare covered cities ka live searchable directory page. |
| 7 | **Location Detail (City SEO)** | `oz/src/pages/LocationDetail.jsx` | `/locations/:slug` | Kisi particular city (e.g. Sydney, Melbourne) ka dynamic SEO-friendly details page. |
| 8 | **Contact Us** | `oz/src/pages/ContactPage.jsx` | `/contact` | Inquiry form, phone numbers, branch address aur trust indicators. |
| 9 | **Sitemap** | `oz/src/pages/Sitemap.jsx` | `/sitemap` | Pure website ke all internal links aur pages ka directory structure. |
| 10 | **404 Not Found** | `oz/src/pages/NotFound.jsx` | `*` (Any unmatched route) | Invalid URL par "Page Not Found" screen with return buttons. |

---

## 🔍 2. Detailed Page-wise Sections Breakdown

### 🏠 1. Home Page (`/`)
* **Hero Section (`Hero.jsx`)**: Animated headlines, key highlights, aur instant quick quote / moving estimate form.
* **Trust Badges Strip (`TrustStrip.jsx`)**: Fully Insured, Professional Movers, Interstate Specialists, Same Day Service, Transparent Pricing.
* **Statistics Counter (`Stats.jsx`)**: 5000+ Moves Completed, 4.9★ Google Rating, 10+ Years Experience, 24/7 Support.
* **Services Grid (`Services.jsx`)**: House Removalists, Office Relocation, Interstate Moving, Furniture Moving, Packing, Storage.
* **Why Choose Us (`WhyChooseUs.jsx`)**: Experienced Team, Affordable Pricing, Safe Padded Trucks, On-Time Delivery, Guarantee.
* **5-Step Moving Process (`MovingProcess.jsx`)**:
  1. *01 Request Quote*
  2. *02 Plan Your Move*
  3. *03 Professional Packing*
  4. *04 Safe Transportation*
  5. *05 Successful Delivery*
* **Service Locations Grid (`Locations.jsx`)**: Melbourne, Sydney, Brisbane, Adelaide, Perth, Canberra preview.
* **Customer Reviews Carousel (`Reviews.jsx`)**: Verified client feedback with star ratings.
* **Operations Photo Gallery (`Gallery.jsx`)**: High-quality visual gallery of trucks, packaging, and moving operations.
* **FAQ Accordion (`FAQ.jsx`)**: Cost, insurance, packing, same-day moving & covered cities ke questions.
* **Contact & Quotation Section (`Contact.jsx`)**: Full interactive quote request form aur contact details.

---

### 🏢 2. Company Profile Page (`/company-profile`)
* **Page Banner (`PageBanner.jsx`)**: Background image, page title, subtitle aur breadcrumbs.
* **Our Story Section**: 10+ Years badge, company origin & commitment to stress-free relocation.
* **Mission & Vision Cards**:
  - *Our Mission*: Reliable & caring removalist experience.
  - *Our Vision*: Australia's most trusted interstate moving brand.
* **Key Stats Counter (`Stats.jsx`)**: Company milestone metrics.
* **Our Values Grid**:
  - *Integrity* (Honest pricing)
  - *Care* (Belongings handling)
  - *Excellence* (Service quality)
  - *Sustainability* (Eco-friendly packing & optimized routes)
* **Team Members Showcase**: Leadership team profiles (Founder, Operations Director, Logistics Manager, Customer Success Lead).

---

### 🚚 3. Services Page (`/services`)
* **Page Banner (`PageBanner.jsx`)**: Comprehensive moving solutions banner.
* **Full-Service Removalist Cards**: 6 core service modules with icons, descriptions aur "Get a Quote" CTAs.
* **Always Included Features Section**:
  - Free in-home or virtual quote
  - Premium packing materials included
  - Fully insured transit cover
  - GPS-tracked dedicated trucks
  - Disassembly & reassembly service
  - Flexible storage options
* **Moving Process Flow (`MovingProcess.jsx`)**: 5-step workflow.
* **Service FAQs (`FAQ.jsx`)**: Common moving questions.

---

### ⭐ 4. Reviews Page (`/reviews`)
* **Page Banner (`PageBanner.jsx`)**: Customer feedback banner.
* **Overall Rating Card**: 4.9 Score based on 1,200+ verified customer reviews.
* **Rating Breakdown Bars**: 5★ (94%), 4★ (5%), 3★ (1%), 2★ (0%), 1★ (0%).
* **Featured Reviews Carousel (`Reviews.jsx`)**: Highlighting top verified reviews.
* **All Reviews Grid**: Detailed testimonials list with client photo, route/service tag, and rating stars.

---

### 📰 5. Blogs Page (`/blogs`)
* **Page Banner (`PageBanner.jsx`)**: Moving tips and expert guides banner.
* **Featured Article Card**: High-visibility large banner article with category tag, published date, read duration, and "Read Article" CTA.
* **Latest Articles Grid**:
  - *10 Essential Tips for a Stress-Free Interstate Move*
  - *How to Pack Fragile Items Like a Professional*
  - *The True Cost of Moving Interstate in 2026*
  - *Office Relocation Checklist for Australian Businesses*
  - *Storage Solutions: Short-Term vs Long-Term*
  - *Moving With Pets: A Complete Guide*

---

### 📍 6. Locations Listing Page (`/locations`)
* **Page Banner with City Search Filter**: Live input bar to filter cities instantly.
* **Available Cities Grid**: Backend API integrated city cards showing:
  - Availability Badge (`Service Available`)
  - State Code (`VIC`, `NSW`, `QLD`, `SA`, `WA`, `ACT`)
  - City Name & Description
  - "View Details" button linking to `/locations/:slug`
* **Custom Route CTA Banner**: "Don't See Your City Listed?" with direct phone call button and custom estimate request link.

---

### 🗺️ 7. Location Detail (City Specific SEO) Page (`/locations/:slug`)
* **Dynamic Hero Banner (`PageBanner.jsx`)**: City-specific dynamic title & subtitle.
* **Breadcrumbs & Action Bar**: Quick navigation (`Home > Locations > City`) & "Call Direct" button.
* **City Introduction Section**: Tailored introduction for the city's interstate movers.
* **Main Removalist Content**: Detailed relocation description.
* **Services in this City**: City-specific service offerings with checkmarks.
* **Why Choose OZ Removalists in this City**: Local service highlights.
* **City Specific Moving FAQs**: Accordion for local moving queries.
* **Popular Interstate Routes Card**: Active highway routes from the selected city.
* **Instant Quote Sidebar Card**: Sticky direct booking and phone call card.

---

### 📞 8. Contact Us Page (`/contact`)
* **Page Banner (`PageBanner.jsx`)**: Contact header banner.
* **Trust Badges Strip (`TrustStrip.jsx`)**: Insurance and service assurance strip.
* **Contact Information Cards**: Phone number, emergency line, email, office address, opening hours.
* **Interactive Quote & Message Form (`Contact.jsx`)**: Name, phone, email, move type, pickup/drop locations, date, and message fields.

---

### 🗺️ 9. Sitemap Page (`/sitemap`)
* **Page Banner (`PageBanner.jsx`)**: Navigation banner.
* **Directory Grid (4 Columns)**:
  - *Main Pages*: Home, Company Profile, Services, Reviews, Blogs, Contact Us.
  - *Our Services*: House Removalists, Office Relocation, Interstate Moving, Furniture, Packing, Storage.
  - *Locations*: Melbourne, Sydney, Brisbane, Adelaide, Perth, Canberra.
  - *Latest Blogs*: Direct links to top blog articles.

---

### 🚫 10. 404 Not Found Page (`*`)
* **Error Graphic & 404 Heading**
* **User-friendly message**
* **Navigation CTA Buttons**: "Back to Home" aur "Contact Support".

---

## 🌐 3. Global Components (Available on Every Page)

1. **Header / Navbar (`Header.jsx`)**:
   - Company Logo (`Logo.jsx`)
   - Animated pill navigation menu
   - Real-time global search bar modal
   - "Contact Us" CTA button
   - Mobile responsive slide-in drawer menu
2. **Footer (`Footer.jsx`)**:
   - Pre-Footer CTA Banner ("Ready for a stress-free move?")
   - Brand details & social media links (Facebook, Instagram, LinkedIn, Twitter, YouTube)
   - Quick navigation columns (Main links, Services, Locations, Contact details)
   - Copyright, ABN number, Sitemap, Privacy Policy, Terms
3. **Floating Sticky CTA (`FloatingCTA.jsx`)**:
   - Screen ke bottom corner par quick Call & Get Quote instant action bar.
4. **Scroll To Top (`ScrollToTop.jsx`)**:
   - Route change hone par automatically screen ko top par scroll karta hai.

---

## 📂 4. Project Directory Map

```text
oz/src/
├── App.jsx                     # Core router with all 10 page routes
├── components/
│   ├── Contact.jsx             # Contact form & details component
│   ├── FAQ.jsx                 # FAQ accordion
│   ├── FloatingCTA.jsx         # Sticky floating call-to-action
│   ├── Footer.jsx              # Global footer
│   ├── Gallery.jsx             # Photo gallery
│   ├── Header.jsx              # Global navbar with search & mobile menu
│   ├── Hero.jsx                # Hero banner with quote form
│   ├── Locations.jsx           # Locations showcase
│   ├── Logo.jsx                # Brand logo component
│   ├── MovingProcess.jsx       # 5-step process component
│   ├── PageBanner.jsx          # Reusable banner for inner pages
│   ├── QuoteForm.jsx           # Interactive quotation form
│   ├── Reviews.jsx             # Testimonials component
│   ├── ScrollToTop.jsx         # Scroll reset utility
│   ├── SectionHeading.jsx      # Reusable section title & eyebrow
│   ├── Services.jsx            # Services cards component
│   ├── Stats.jsx               # Metric counters component
│   ├── TrustStrip.jsx          # Trust badges bar
│   ├── WhyChooseUs.jsx         # Value propositions component
│   └── seo/
│       └── LocationSEO.jsx     # Dynamic JSON-LD schema & meta tags
├── data/
│   └── siteData.js             # Centralized static content, services, reviews, blogs
├── pages/
│   ├── Blogs.jsx               # Blogs page
│   ├── CompanyProfile.jsx      # Company profile page
│   ├── ContactPage.jsx         # Contact page
│   ├── Home.jsx                # Home page
│   ├── LocationDetail.jsx      # Dynamic location detail page
│   ├── Locations.jsx           # Locations directory page
│   ├── NotFound.jsx            # 404 page
│   ├── ReviewsPage.jsx         # Reviews page
│   ├── Services.jsx            # Services page
│   └── Sitemap.jsx             # Sitemap page
└── services/
    └── locationService.js      # API calls for fetching dynamic locations
```
