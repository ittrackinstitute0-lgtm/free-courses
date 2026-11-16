# Free Courses Pakistan (PakCourses Free) 🇵🇰

A clean, minimalist, responsive, and user-friendly website built in pure **HTML5, CSS3, and JavaScript**. 

This platform is specifically designed to post daily announcements of **100% free courses, IT bootcamps, and technical skills trainings** from every corner of Pakistan.

The courses section and listings are **completely blank**, built specifically to be populated by an **AI automation pipeline**.

---

## 📁 Clean Folder & File Structure

```text
free-courses/
│
├── index.html          # Main website markup (Hero, Regional Filters, Blank Course Feed, Modals)
├── README.md           # Documentation
│
├── css/
│   └── style.css       # Clean, modern responsive CSS (Dark/Light theme, CSS Grid & Flexbox)
│
├── js/
│   ├── app.js          # Dynamic UI controller (Search, region filters, modals, bookmarking)
│   └── data.js         # Data fetcher connected directly to data/courses.json
│
└── data/
    └── courses.json    # Live JSON database (currently [] empty array, waiting for AI pipeline)
```

---

## 🤖 AI Automation Pipeline Integration

Your AI automation pipeline can post new courses simply by updating **`data/courses.json`**.

### Expected JSON Schema:
```json
[
  {
    "id": "pk-101",
    "title": "Course Title",
    "provider": "Institute Name",
    "category": "Tech & AI",
    "city": "City Name",
    "province": "Punjab / Sindh / KPK / Balochistan / Islamabad Capital Territory / Gilgit-Baltistan / Azad Kashmir / Nationwide Online",
    "mode": "Online / Physical / Hybrid",
    "duration": "3 Months",
    "deadline": "YYYY-MM-DD",
    "stipend": true,
    "certificate": true,
    "description": "Brief description of the free course opportunity.",
    "applyUrl": "https://...",
    "announcedDate": "YYYY-MM-DD",
    "featured": true
  }
]
```

As soon as your pipeline writes objects into `data/courses.json`, the website will automatically render the course cards, badges, filters, search, and details with zero manual frontend changes.

---

## 🚀 Running Locally

```powershell
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.
