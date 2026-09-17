/* ==========================================================
   NΦMADISCH — Theme toggle
   Manual light/sand ⇄ dark/blue toggle. Defaults to light.
   Remembers the visitor's choice in this browser only
   (localStorage), never changes based on system settings.

   To reuse on another page: include this file, and add a button
   with id="theme-toggle" anywhere in that page's nav.
   ========================================================== */

(function () {
  const STORAGE_KEY = "nomadisch-theme";

  function apply(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "☀ Light" : "☾ Dark";
  }

  let saved = "light";
  try {
    saved = localStorage.getItem(STORAGE_KEY) || "light";
  } catch (e) {
    /* localStorage unavailable — fall back to light, silently */
  }
  apply(saved);

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    apply(saved); // set correct label once the button exists
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore — theme just won't persist across visits */
      }
    });
  });
})();
