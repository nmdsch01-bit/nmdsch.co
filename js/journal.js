/* ==========================================================
   NΦMADISCH — Journal renderer
   Reads journalEntries + CATEGORY_LABELS from journal-data.js
   and builds the filter pills + the card grid. You should not
   need to edit this file when adding new texts — edit
   journal-data.js instead.
   ========================================================== */

(function () {
  const PAGE_SIZE = 9; // multiple of 3 so the grid stays even

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

  function entryCard(entry) {
    const a = document.createElement("a");
    a.className = "entry-card";
    a.href = entry.url || "#";

    const thumb = document.createElement("div");
    thumb.className = "entry-thumb";
    if (entry.image) {
      const img = document.createElement("img");
      img.src = entry.image;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
    }
    // If no image is set yet, the thumb stays an empty --paper-raised block.

    const tags = document.createElement("div");
    tags.className = "entry-tags";
    tags.innerHTML = `
      <span class="cat" style="--cat-color:${categoryColorVar(entry.category)}">${CATEGORY_LABELS[entry.category] || entry.category}</span>
      <span class="type">${entry.readTime} min</span>
    `;

    const h3 = document.createElement("h3");
    h3.textContent = entry.title;

    const dek = document.createElement("p");
    dek.className = "dek";
    dek.textContent = entry.dek;

    const meta = document.createElement("p");
    meta.className = "entry-meta";
    meta.textContent = formatDate(entry.date);

    a.appendChild(thumb);
    a.appendChild(tags);
    a.appendChild(h3);
    a.appendChild(dek);
    a.appendChild(meta);
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
      listEl.appendChild(entryCard(entry));
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
