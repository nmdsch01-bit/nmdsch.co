/* ==========================================================
   NΦMADISCH — Journal renderer
   Reads journalEntries + CATEGORY_LABELS from journal-data.js
   and builds the filter tabs + the entry list. You should not
   need to edit this file when adding new texts — edit
   journal-data.js instead.
   ========================================================== */

(function () {
  const PAGE_SIZE = 8;

  const listEl = document.getElementById("journal-list");
  const filtersEl = document.getElementById("filters");
  const loadMoreBtn = document.getElementById("load-more");

  let activeCategory = "all";
  let visibleCount = PAGE_SIZE;

  // Sort newest first, regardless of the order entries were added
  // to journal-data.js.
  const sortedEntries = [...journalEntries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  function categoryColorVar(category) {
    return `var(--cat-${category})`;
  }

  function buildFilters() {
    const categoriesInUse = [...new Set(sortedEntries.map((e) => e.category))];

    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.dataset.category = "all";
    allBtn.className = "active";
    allBtn.addEventListener("click", () => setActiveCategory("all"));
    filtersEl.appendChild(allBtn);

    categoriesInUse.forEach((cat) => {
      const btn = document.createElement("button");
      btn.textContent = CATEGORY_LABELS[cat] || cat;
      btn.dataset.category = cat;
      btn.addEventListener("click", () => setActiveCategory(cat));
      filtersEl.appendChild(btn);
    });
  }

  function setActiveCategory(cat) {
    activeCategory = cat;
    visibleCount = PAGE_SIZE;
    [...filtersEl.children].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === cat);
    });
    render();
  }

  function entryRow(entry) {
    const a = document.createElement("a");
    a.className = "entry-row";
    a.href = entry.url || "#";
    a.style.setProperty("--cat-color", categoryColorVar(entry.category));

    const thumb = document.createElement("div");
    thumb.className = "entry-thumb";
    thumb.style.borderLeftColor = categoryColorVar(entry.category);
    if (entry.image) {
      const img = document.createElement("img");
      img.src = entry.image;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
    } else {
      thumb.style.background = "var(--paper-raised)";
    }

    const body = document.createElement("div");
    body.className = "entry-body";
    body.innerHTML = `
      <p class="kicker" style="color:${categoryColorVar(entry.category)}">${CATEGORY_LABELS[entry.category] || entry.category}</p>
      <h3>${entry.title}</h3>
      <p class="dek">${entry.dek}</p>
      <div class="entry-meta">
        <span>${formatDate(entry.date)}</span>
        <span class="dot"></span>
        <span>${entry.readTime} min read</span>
      </div>
    `;

    a.appendChild(thumb);
    a.appendChild(body);
    return a;
  }

  function render() {
    listEl.innerHTML = "";

    const filtered = sortedEntries.filter(
      (e) => activeCategory === "all" || e.category === activeCategory
    );

    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No entries in this category yet.";
      listEl.appendChild(empty);
      loadMoreBtn.hidden = true;
      return;
    }

    filtered.slice(0, visibleCount).forEach((entry) => {
      listEl.appendChild(entryRow(entry));
    });

    loadMoreBtn.hidden = filtered.length <= visibleCount;
  }

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    render();
  });

  buildFilters();
  render();
})();
