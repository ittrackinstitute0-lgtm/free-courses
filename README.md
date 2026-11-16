# Free Courses Pakistan (PakCourses Free) 🇵🇰

A clean, minimalist, responsive, and user-friendly website built in pure **HTML5, CSS3, and JavaScript**. 

This platform is specifically designed to post daily announcements of **100% free courses, IT bootcamps, and technical skills trainings** from every corner of Pakistan (Islamabad, Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, and Azad Jammu & Kashmir).

As requested, the courses section is **kept blank by default** with a clean empty state, ready to receive incoming announcements whenever new courses are announced anywhere in Pakistan.

---

## 📁 Complete Folder & File Structure

```text
free courses/
│
├── index.html               # Main website markup (Hero, Search/Filter bar, Blank Courses Section, Modals, Footer)
│
├── css/
│   └── style.css            # Clean, minimalist & responsive styling (CSS Variables, Flexbox/Grid, Dark Mode)
│
├── js/
│   ├── app.js               # Application logic (Filtering, Search, Sorting, Rendering, Empty States, Modals, Bookmarks)
│   └── data.js              # Data loader & sample Pakistan dataset for preview testing
│
├── data/
│   ├── courses.json         # Live course data source (currently [] blank as requested)
│   └── courses.sample.json  # Reference sample data containing realistic free courses across Pakistan
│
└── README.md                # Project documentation and guide
```

---

## ✨ Key Features

1. **Clean & Minimalist Design**:
   - Modern Pakistani emerald & neutral design palette (`#006644`).
   - Clean system typography with Google Fonts (*Plus Jakarta Sans*).
   - High readability, subtle micro-interactions, and zero clutter.

2. **Blank State Ready**:
   - Currently, the course feed is completely blank as requested.
   - Shows an elegant, friendly empty state: *"No Courses Announced Yet Today. Whenever a verified free course is announced in Pakistan, it will appear right here."*
   - Includes a **"Preview Sample Data"** toggle button in the header so you can test and view how cards render with 1 click, and switch back to blank anytime.

3. **Filtering & Discovery**:
   - **Full-text live search**: Search by course title, provider (*NAVTTC, DigiSkills, Saylani, PITB, etc.*), or city.
   - **Province / Territory filter**: Nationwide Online, Punjab, Sindh, KPK, Balochistan, Islamabad (ICT), Gilgit-Baltistan, AJK.
   - **Category filter**: Tech & AI, Freelancing & Digital Skills, Graphic Design, Vocational & Technical, Business.
   - **Delivery Mode filter**: Online, Physical (On-campus), Hybrid.
   - **Quick chips**: Fast filters for NAVTTC, DigiSkills, Saylani, Courses with Stipends, and Bookmarks.

4. **Interactive Utilities**:
   - **Submit Course Modal**: Allows users or institutes to submit new course announcements directly through the UI.
   - **Daily Alerts Modal**: Allows users to sign up for WhatsApp / Email daily course notifications.
   - **Bookmarking**: Save courses to browser `localStorage` for offline review.
   - **One-click Share**: Native Web Share API or clipboard link copying.
   - **Dark / Light Mode**: Built-in toggle that remembers user preference.

5. **100% Responsive**:
   - Fluid experience across mobile phones, tablets, laptops, and wide desktop displays.

---

## 📝 How to Add New Courses

Whenever a new free course is announced in Pakistan, you can add it in one of three easy ways:

### Method 1: Directly from the Website UI
1. Click the **"Submit Course"** button in the navigation bar.
2. Fill in the course details (Title, Provider, City/Province, Apply URL, Deadline, Stipend).
3. Click **"Post Free Course Announcement"**.
4. It will immediately appear on your website!

### Method 2: By Editing `data/courses.json`
Add items directly into `data/courses.json` using the standard schema:

```json
[
  {
    "id": "pk-101",
    "title": "Prime Minister's High-Tech Skills Training (AI & Python)",
    "provider": "NAVTTC Pakistan",
    "category": "Tech & AI",
    "city": "Islamabad",
    "province": "Islamabad Capital Territory",
    "mode": "Physical",
    "duration": "3 Months",
    "deadline": "2026-12-10",
    "stipend": true,
    "certificate": true,
    "description": "Free high-tech training program for Pakistani youth under NAVTTC with monthly stipend, labs, and recognized certification.",
    "applyUrl": "https://nsis.navttc.gov.pk/",
    "announcedDate": "2026-11-16",
    "featured": true
  }
]
```
*(Check `data/courses.sample.json` for more sample entries from Karachi, Lahore, Quetta, Peshawar, and Gilgit).*

### Method 3: Automated Daily Updates (Scraper / Webhook)
You can automate daily updates by running a Python script or GitHub Action that checks government portals (like NAVTTC, DigiSkills, TEVTA boards) and writes the output directly to `data/courses.json`.

---

## 🚀 How to Run the Website

### Option A: Open directly in your browser
Simply double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari. Everything is self-contained.

### Option B: Run with a local development server
If you prefer running a local server:
```powershell
# Using Python:
python -m http.server 8000

# Using Node.js (npx serve):
npx serve .
```
Then visit `http://localhost:8000` in your web browser.

---

## 🌐 Deploying to the Web

You can host this website completely free of cost on:
- **GitHub Pages**: Push this folder to a GitHub repository and enable Pages in repository settings.
- **Netlify / Vercel**: Drag and drop the folder into Netlify Drop or link to your repository.
- **Any Standard Web Host (cPanel, Apache, Nginx)**: Upload all files into your `public_html` directory.
