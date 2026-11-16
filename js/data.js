/**
 * Free Courses Pakistan - Data Handler
 * Completely blank. Connects directly to data/courses.json for the AI automation pipeline.
 */

async function fetchCoursesData() {
  try {
    const res = await fetch("data/courses.json", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}
