/*
============================================================
NOMADISCH — script.js
Funções:
1. Header blur on scroll
2. Progress bar
3. Mobile menu
4. Search bar
5. Category filtering
6. Intersection animations
7. Newsletter fake submit
============================================================
*/


/* ============================================================
  HEADER — adiciona classe ao rolar
============================================================ */

const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 12) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


/* ============================================================
  PROGRESS BAR
============================================================ */

const progressBar = document.getElementById('reading-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = `${progress}%`;
});


/* ============================================================
  MOBILE NAV
============================================================ */

const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');

    navToggle.classList.toggle('is-open');

    navToggle.setAttribute('aria-expanded', isOpen);
  });
}


/* ============================================================
  SEARCH BAR
============================================================ */

const searchTrigger = document.getElementById('search-trigger');
const searchClose = document.getElementById('search-close');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');

function openSearch() {
  searchBar.classList.add('is-open');
  searchBar.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    searchInput.focus();
  }, 150);
}

function closeSearch() {
  searchBar.classList.remove('is-open');
  searchBar.setAttribute('aria-hidden', 'true');
}

if (searchTrigger) {
  searchTrigger.addEventListener('click', openSearch);
}

if (searchClose) {
  searchClose.addEventListener('click', closeSearch);
}


/* ============================================================
  CATEGORY FILTER
============================================================ */

const chips = document.querySelectorAll('.category-chip');
const cards = document.querySelectorAll('.article-card');
const articlesCount = document.getElementById('articles-count');

chips.forEach(chip => {
  chip.addEventListener('click', () => {

    chips.forEach(c => {
      c.classList.remove('category-chip--active');
      c.setAttribute('aria-pressed', 'false');
    });

    chip.classList.add('category-chip--active');
    chip.setAttribute('aria-pressed', 'true');

    const category = chip.dataset.category;

    let visibleCount = 0;

    cards.forEach(card => {

      if (
        category === 'all' ||
        card.dataset.category === category
      ) {
        card.style.display = 'flex';
        card.setAttribute('aria-hidden', 'false');

        visibleCount++;
      } else {
        card.style.display = 'none';
        card.setAttribute('aria-hidden', 'true');
      }

    });

    if (articlesCount) {
      articlesCount.textContent =
        `${visibleCount} article${visibleCount !== 1 ? 's' : ''}`;
    }

  });
});


/* ============================================================
  INTERSECTION OBSERVER
============================================================ */

const animatedElements = document.querySelectorAll(
  '.article-card, .featured-card, .editorial-quote blockquote, .about-inner'
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.15
  }
);

animatedElements.forEach(el => observer.observe(el));


/* ============================================================
  NEWSLETTER
============================================================ */

const newsletterForm = document.getElementById('newsletter-form');
const formMessage = document.getElementById('form-message');

if (newsletterForm) {

  newsletterForm.addEventListener('submit', e => {

    e.preventDefault();

    const emailInput =
      document.getElementById('newsletter-email');

    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {

      formMessage.textContent =
        'Please enter a valid email address.';

      formMessage.className =
        'form-message form-message--error';

      return;
    }

    formMessage.textContent =
      'Thank you for subscribing.';

    formMessage.className =
      'form-message form-message--success';

    newsletterForm.reset();

  });

}
