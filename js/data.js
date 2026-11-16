/**
 * Free Courses Pakistan - Data Handler
 * Default data is kept blank as requested.
 * Includes sample Pakistan courses for optional live preview testing.
 */

const SAMPLE_COURSES = [
  {
    id: "pk-001",
    title: "Prime Minister's High-Tech Skills Training (AI & Python)",
    provider: "NAVTTC Pakistan",
    category: "Tech & AI",
    city: "Islamabad",
    province: "Islamabad Capital Territory",
    mode: "Physical",
    duration: "3 Months",
    deadline: "2026-12-10",
    stipend: true,
    certificate: true,
    description: "Free high-tech training program for Pakistani youth under NAVTTC with monthly stipend, labs, and recognized certification.",
    applyUrl: "https://nsis.navttc.gov.pk/",
    announcedDate: "2026-11-16",
    featured: true
  },
  {
    id: "pk-002",
    title: "DigiSkills Free Freelancing & SEO Mastery",
    provider: "DigiSkills.pk (Ignite & MoITT)",
    category: "Freelancing & Digital Skills",
    city: "Nationwide",
    province: "Nationwide Online",
    mode: "Online",
    duration: "12 Weeks",
    deadline: "2026-11-30",
    stipend: false,
    certificate: true,
    description: "Government of Pakistan's flagship online digital training initiative offering 15+ high-demand freelancing courses completely free.",
    applyUrl: "https://digiskills.pk/",
    announcedDate: "2026-11-15",
    featured: true
  },
  {
    id: "pk-003",
    title: "Certified Cloud Native & GenAI Engineering",
    provider: "Saylani Welfare Mass IT Training (SMIT)",
    category: "Tech & AI",
    city: "Karachi",
    province: "Sindh",
    mode: "Hybrid",
    duration: "6 Months",
    deadline: "2026-12-05",
    stipend: false,
    certificate: true,
    description: "Saylani's free IT scholarship program for youth in Karachi, Hyderabad, and Faisalabad. Admission test required.",
    applyUrl: "https://saylaniwelfare.com/",
    announcedDate: "2026-11-14",
    featured: false
  },
  {
    id: "pk-004",
    title: "e-Rozgaar Center On-Campus Training (Technical Track)",
    provider: "PITB & Youth Affairs Punjab",
    category: "Tech & AI",
    city: "Lahore",
    province: "Punjab",
    mode: "Physical",
    duration: "3 Months",
    deadline: "2026-12-01",
    stipend: false,
    certificate: true,
    description: "Free freelancing and tech training at government university centers across 36 districts of Punjab.",
    applyUrl: "https://erozgaar.pitb.gov.pk/",
    announcedDate: "2026-11-14",
    featured: false
  },
  {
    id: "pk-005",
    title: "KP Youth Digital Skills: UI/UX & Graphic Design",
    provider: "KPITB (Khyber Pakhtunkhwa IT Board)",
    category: "Graphic Design & Media",
    city: "Peshawar",
    province: "Khyber Pakhtunkhwa",
    mode: "Physical",
    duration: "2 Months",
    deadline: "2026-12-20",
    stipend: true,
    certificate: true,
    description: "Subsidized and free design training for KP residents with verified certification and career mentoring.",
    applyUrl: "https://kpitb.gov.pk/",
    announcedDate: "2026-11-13",
    featured: false
  },
  {
    id: "pk-006",
    title: "Balochistan Tech Initiative: Web & Mobile App Dev",
    provider: "B-TEVTA & AlKhidmat Foundation",
    category: "Tech & AI",
    city: "Quetta",
    province: "Balochistan",
    mode: "Physical",
    duration: "4 Months",
    deadline: "2026-12-25",
    stipend: true,
    certificate: true,
    description: "Special technical capacity-building training program for youth of Quetta and interior Balochistan.",
    applyUrl: "https://alkhidmat.org/",
    announcedDate: "2026-11-12",
    featured: false
  },
  {
    id: "pk-007",
    title: "Gilgit & Skardu Remote Freelancing Bootcamp",
    provider: "Karakoram Tech Hub & KIU",
    category: "Freelancing & Digital Skills",
    city: "Gilgit",
    province: "Gilgit-Baltistan",
    mode: "Hybrid",
    duration: "8 Weeks",
    deadline: "2026-12-18",
    stipend: false,
    certificate: true,
    description: "Free digital skills program aimed at expanding remote work and freelance opportunities in Gilgit-Baltistan.",
    applyUrl: "https://kiu.edu.pk/",
    announcedDate: "2026-11-10",
    featured: false
  }
];

// Helper to fetch live courses from data/courses.json or fallback
async function fetchCoursesData() {
  try {
    const res = await fetch("data/courses.json");
    if (!res.ok) throw new Error("Could not fetch data/courses.json");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // If running from file:// protocol where fetch is blocked by browser CORS,
    // or if the JSON file is empty, return empty array as default
    console.info("Info: Running in standalone or empty state mode:", err.message);
    const stored = localStorage.getItem("pk_free_courses");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}
