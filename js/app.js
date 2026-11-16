/**
 * Free Courses Pakistan - Application Controller
 * Handles search, filter, render, empty states, bookmarking, and submissions.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let allCourses = [];
  let isDemoActive = false;
  let bookmarkedIds = JSON.parse(localStorage.getItem("pk_bookmarked_courses") || "[]");
  let activeQuickFilter = null;

  // DOM Elements
  const container = document.getElementById("coursesContainer");
  const courseCountBadge = document.getElementById("courseCountBadge");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const provinceFilter = document.getElementById("provinceFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const modeFilter = document.getElementById("modeFilter");
  const sortSelect = document.getElementById("sortSelect");
  const demoToggleBtn = document.getElementById("demoToggleBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  
  // Modals & Forms
  const submitModal = document.getElementById("submitModal");
  const openSubmitModalBtns = document.querySelectorAll(".btn-open-submit");
  const closeSubmitModalBtn = document.getElementById("closeSubmitModal");
  const submitForm = document.getElementById("submitCourseForm");

  const alertModal = document.getElementById("alertModal");
  const openAlertModalBtns = document.querySelectorAll(".btn-open-alert");
  const closeAlertModalBtn = document.getElementById("closeAlertModal");
  const alertForm = document.getElementById("subscribeAlertForm");

  // Chips
  const chipButtons = document.querySelectorAll(".chip");

  // 1. Initialize Theme
  initTheme();

  // 2. Fetch Initial Courses (blank by default as requested)
  allCourses = await fetchCoursesData();
  renderCourses();

  // 3. Search & Filter Listeners
  searchInput.addEventListener("input", () => {
    clearSearchBtn.classList.toggle("active", searchInput.value.length > 0);
    renderCourses();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.classList.remove("active");
    searchInput.focus();
    renderCourses();
  });

  provinceFilter.addEventListener("change", renderCourses);
  categoryFilter.addEventListener("change", renderCourses);
  modeFilter.addEventListener("change", renderCourses);
  sortSelect.addEventListener("change", renderCourses);

  // Quick Chips
  chipButtons.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterType = chip.getAttribute("data-filter");
      if (activeQuickFilter === filterType) {
        activeQuickFilter = null;
        chip.classList.remove("active");
      } else {
        chipButtons.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeQuickFilter = filterType;
      }
      renderCourses();
    });
  });

  // 4. Demo Data Toggle (Allows user to preview filled cards or keep blank)
  if (demoToggleBtn) {
    demoToggleBtn.addEventListener("click", () => {
      if (!isDemoActive) {
        allCourses = [...SAMPLE_COURSES];
        isDemoActive = true;
        demoToggleBtn.textContent = "Clear to Blank Mode";
        demoToggleBtn.classList.add("btn-subtle");
        showToast("Loaded sample Pakistan courses for preview!");
      } else {
        allCourses = [];
        isDemoActive = false;
        demoToggleBtn.textContent = "Preview Sample Data";
        demoToggleBtn.classList.remove("btn-subtle");
        showToast("Reset to blank section.");
      }
      renderCourses();
    });
  }

  // 5. Main Filter & Render Logic
  function getFilteredCourses() {
    const q = searchInput.value.trim().toLowerCase();
    const selProvince = provinceFilter.value;
    const selCategory = categoryFilter.value;
    const selMode = modeFilter.value;
    const sortBy = sortSelect.value;

    return allCourses
      .filter((course) => {
        // Keyword Search
        if (q) {
          const matchTitle = (course.title || "").toLowerCase().includes(q);
          const matchProvider = (course.provider || "").toLowerCase().includes(q);
          const matchCity = (course.city || "").toLowerCase().includes(q);
          const matchDesc = (course.description || "").toLowerCase().includes(q);
          if (!matchTitle && !matchProvider && !matchCity && !matchDesc) return false;
        }

        // Dropdown Filters
        if (selProvince && course.province !== selProvince) return false;
        if (selCategory && course.category !== selCategory) return false;
        if (selMode && course.mode !== selMode) return false;

        // Quick Chips Filters
        if (activeQuickFilter) {
          if (activeQuickFilter === "stipend" && !course.stipend) return false;
          if (activeQuickFilter === "navttc" && !course.provider.toLowerCase().includes("navttc")) return false;
          if (activeQuickFilter === "digiskills" && !course.provider.toLowerCase().includes("digiskills")) return false;
          if (activeQuickFilter === "saylani" && !course.provider.toLowerCase().includes("saylani")) return false;
          if (activeQuickFilter === "saved") {
            if (!bookmarkedIds.includes(course.id)) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") {
          return new Date(a.deadline || "2099-01-01") - new Date(b.deadline || "2099-01-01");
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else {
          // Default: newest announced
          return new Date(b.announcedDate || 0) - new Date(a.announcedDate || 0);
        }
      });
  }

  function renderCourses() {
    const filtered = getFilteredCourses();
    courseCountBadge.textContent = `${filtered.length} course${filtered.length === 1 ? "" : "s"}`;

    if (filtered.length === 0) {
      renderEmptyState();
      return;
    }

    container.innerHTML = filtered
      .map((c) => {
        const isSaved = bookmarkedIds.includes(c.id);
        return `
        <article class="course-card" id="card-${c.id}">
          <div>
            <div class="card-top">
              <span class="location-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${escapeHtml(c.city || "Pakistan")}, ${escapeHtml(c.province || "All")}
              </span>
              <div class="badges-group">
                <span class="badge badge-free">100% Free</span>
                ${c.stipend ? '<span class="badge badge-stipend">With Stipend</span>' : ""}
              </div>
            </div>

            <div class="course-provider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              ${escapeHtml(c.provider || "Institute")}
            </div>

            <h3 class="course-title">${escapeHtml(c.title)}</h3>
            <p class="course-desc">${escapeHtml(c.description || "Free training opportunity with recognized certification.")}</p>
          </div>

          <div>
            <div class="card-meta-grid">
              <div class="meta-item">
                <span class="meta-label">Mode</span>
                <span class="meta-val">${escapeHtml(c.mode || "Online")}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Duration</span>
                <span class="meta-val">${escapeHtml(c.duration || "Self-Paced")}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Last Date</span>
                <span class="meta-val">${formatDate(c.deadline)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Certificate</span>
                <span class="meta-val">${c.certificate ? "Verified Free" : "Included"}</span>
              </div>
            </div>

            <div class="card-actions">
              <a href="${escapeHtml(c.applyUrl || "#")}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-apply">
                Apply Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              <button class="btn btn-icon-only bookmark-btn ${isSaved ? "active" : ""}" data-id="${c.id}" title="${isSaved ? "Remove Bookmark" : "Save Course"}" aria-label="Bookmark course">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button class="btn btn-icon-only share-btn" data-title="${escapeHtml(c.title)}" data-url="${escapeHtml(c.applyUrl || window.location.href)}" title="Share" aria-label="Share course">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    attachCardEventListeners();
  }

  // Render Clean Empty State
  function renderEmptyState() {
    const hasFilters = searchInput.value || provinceFilter.value || categoryFilter.value || modeFilter.value || activeQuickFilter;

    if (hasFilters) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 class="empty-state-title">No Matching Courses Found</h3>
          <p class="empty-state-desc">Try clearing your filters or search keywords to see other announcements across Pakistan.</p>
          <div class="empty-state-actions">
            <button class="btn btn-outline" id="resetFiltersBtn">Reset All Filters</button>
          </div>
        </div>
      `;
      document.getElementById("resetFiltersBtn")?.addEventListener("click", resetAllFilters);
    } else {
      // Default clean blank state as requested by user
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <path d="M12 6v6"></path>
              <path d="M9 9h6"></path>
            </svg>
          </div>
          <h3 class="empty-state-title">No Courses Announced Yet Today</h3>
          <p class="empty-state-desc">
            Whenever a verified free course, technical bootcamp, or scholarship is announced anywhere in Pakistan (NAVTTC, TEVTA, universities, or tech foundations), it will instantly appear right here.
          </p>
          <div class="empty-state-actions">
            <button class="btn btn-primary btn-open-alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Get Daily WhatsApp / Email Alerts
            </button>
            <button class="btn btn-outline btn-open-submit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Submit a Free Course You Found
            </button>
            <button class="btn btn-subtle" id="previewSamplesInlineBtn">
              Preview Demo Layout
            </button>
          </div>
        </div>
      `;

      // Re-bind modal triggers inside dynamic empty state
      document.querySelector(".empty-state .btn-open-alert")?.addEventListener("click", () => openModal(alertModal));
      document.querySelector(".empty-state .btn-open-submit")?.addEventListener("click", () => openModal(submitModal));
      document.getElementById("previewSamplesInlineBtn")?.addEventListener("click", () => {
        demoToggleBtn?.click();
      });
    }
  }

  function resetAllFilters() {
    searchInput.value = "";
    clearSearchBtn.classList.remove("active");
    provinceFilter.value = "";
    categoryFilter.value = "";
    modeFilter.value = "";
    activeQuickFilter = null;
    chipButtons.forEach((c) => c.classList.remove("active"));
    renderCourses();
  }

  // Card Event Listeners (Bookmark & Share)
  function attachCardEventListeners() {
    // Bookmarks
    document.querySelectorAll(".bookmark-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (bookmarkedIds.includes(id)) {
          bookmarkedIds = bookmarkedIds.filter((item) => item !== id);
          btn.classList.remove("active");
          btn.querySelector("svg").setAttribute("fill", "none");
          showToast("Course removed from bookmarks.");
        } else {
          bookmarkedIds.push(id);
          btn.classList.add("active");
          btn.querySelector("svg").setAttribute("fill", "currentColor");
          showToast("Course saved to bookmarks!");
        }
        localStorage.setItem("pk_bookmarked_courses", JSON.stringify(bookmarkedIds));
      });
    });

    // Share
    document.querySelectorAll(".share-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const title = btn.getAttribute("data-title");
        const url = btn.getAttribute("data-url");
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: `Check out this 100% free course in Pakistan: ${title}`,
              url: url
            });
          } catch (e) {
            // User dismissed or failed
          }
        } else {
          navigator.clipboard.writeText(url);
          showToast("Course link copied to clipboard!");
        }
      });
    });
  }

  // 6. Modals Management
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  openSubmitModalBtns.forEach((btn) => btn.addEventListener("click", () => openModal(submitModal)));
  closeSubmitModalBtn?.addEventListener("click", () => closeModal(submitModal));

  openAlertModalBtns.forEach((btn) => btn.addEventListener("click", () => openModal(alertModal)));
  closeAlertModalBtn?.addEventListener("click", () => closeModal(alertModal));

  [submitModal, alertModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(submitModal);
      closeModal(alertModal);
    }
  });

  // 7. Handle Course Submission Form
  submitForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(submitForm);
    const newCourse = {
      id: "pk-user-" + Date.now(),
      title: formData.get("courseTitle").trim(),
      provider: formData.get("providerName").trim(),
      province: formData.get("province"),
      city: formData.get("city").trim() || "Nationwide",
      category: formData.get("category"),
      mode: formData.get("mode"),
      duration: formData.get("duration").trim() || "Announced",
      deadline: formData.get("deadline") || "Rolling",
      applyUrl: formData.get("applyUrl").trim() || "#",
      description: formData.get("description").trim() || "Free training opportunity in Pakistan.",
      stipend: formData.get("stipend") === "on",
      certificate: true,
      announcedDate: new Date().toISOString().split("T")[0],
      featured: false
    };

    allCourses.unshift(newCourse);
    localStorage.setItem("pk_free_courses", JSON.stringify(allCourses));

    submitForm.reset();
    closeModal(submitModal);
    renderCourses();
    showToast("Course submitted successfully! It is now live on your site.");
  });

  // 8. Handle Daily Alert Subscription
  alertForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const contact = alertForm.querySelector("input[name='contact']").value;
    alertForm.reset();
    closeModal(alertModal);
    showToast(`Subscribed successfully for ${contact}! You'll receive daily updates.`);
  });

  // 9. Theme Management (Light / Dark)
  function initTheme() {
    const savedTheme = localStorage.getItem("pk_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("pk_theme", next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === "dark") {
      themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute("title", "Switch to light mode");
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute("title", "Switch to dark mode");
    }
  }

  // Utilities
  function formatDate(dateStr) {
    if (!dateStr || dateStr === "Rolling") return "Rolling / Open";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
