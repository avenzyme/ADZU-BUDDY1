// -----------------------------------------------------------------------------
// ADZU BUDDY — navigation and page-view controls
// -----------------------------------------------------------------------------
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// Show one clean content area at a time instead of a very long single page.
function showPage(pageName) {
  document.querySelectorAll('.page-view').forEach(page => {
    page.hidden = page.dataset.page !== pageName;
  });
  document.querySelectorAll('[data-page-link]').forEach(link => {
    if (link.dataset.pageLink === pageName) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.classList.remove('show');
    dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-page-link]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showPage(link.dataset.pageLink);
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Dropdowns are click-controlled.  < hover cue and changes it to ▼ while the dropdown is open
document.querySelectorAll('.nav-dropdown-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const dropdown = button.closest('.nav-dropdown');
    const willOpen = !dropdown.classList.contains('show');
    document.querySelectorAll('.nav-dropdown').forEach(item => {
      item.classList.remove('show');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
    dropdown.classList.toggle('show', willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
  });
});

document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(item => {
      item.classList.remove('show');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  }
});

// Open the home view by default, or restore the selected section from the URL.
const initialPage = location.hash.replace('#', '');
const validPages = ['home', 'explore', 'guides', 'resources', 'faq', 'organizations', 'contact', 'admin'];
showPage(validPages.includes(initialPage) ? initialPage : 'home');


// -----------------------------------------------------------------------------
// Light / dark theme switch
// The site defaults to light mode. The user's selected theme is remembered in
// this browser only; no website information is changed.
// -----------------------------------------------------------------------------
const themeToggle = document.getElementById('themeToggle');
const THEME_STORAGE_KEY = 'adzuBuddyTheme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

let savedTheme = 'light';
try {
  savedTheme = localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
} catch {
  savedTheme = 'light';
}
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch { /* storage may be unavailable */ }
});

// -----------------------------------------------------------------------------
// Campus directory search/filter
// -----------------------------------------------------------------------------
// Search and filter the campus directory.
const placeSearch = document.getElementById('placeSearch');
const placeCategory = document.getElementById('placeCategory');
const placeGrid = document.getElementById('placeGrid');
const emptyPlaces = document.getElementById('emptyPlaces');

function filterPlaces() {
  const term = placeSearch.value.trim().toLowerCase();
  const category = placeCategory.value;
  let visible = 0;

  placeGrid.querySelectorAll('.place-card').forEach(card => {
    const matchesText = (card.dataset.search + ' ' + card.textContent).toLowerCase().includes(term);
    const matchesCategory = category === 'all' || card.dataset.category === category;
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyPlaces.hidden = visible !== 0;
}
if (placeSearch && placeCategory && placeGrid && emptyPlaces) {
  placeSearch.addEventListener('input', filterPlaces);
  placeCategory.addEventListener('change', filterPlaces);
}

// -----------------------------------------------------------------------------
// Student guide content
// -----------------------------------------------------------------------------
// Student guides based on information published by AdZU.
const guideContent = {
  enrollment: {
    title: '1. Enrollment guide',
    sections: [
      {
        heading: 'Official information',
        intro: 'For incoming college students, the College Admissions and Aid Office handles admission and enrollment.',
        subheading: 'Basic enrollment requirements for new college students:',
        items: [
          'Original Report Card (Form 138)',
          'Original Certificate of Good Moral Character',
          'Photocopy of PSA Birth Certificate',
          'College Entrance Test result'
        ]
      },
      {
        subheading: 'For transferees:',
        items: [
          'Original Transfer Credential (Honorable Dismissal)',
          'Original Certificate of Good Moral Character',
          'Original Transcript of Records',
          'Photocopy of Birth Certificate',
          'College Entrance Test result'
        ]
      }
    ],
    links: [
      { label: 'College Admissions and Aid Office', url: 'https://adzu.edu.ph/about-us/admissions-aid/' }
    ],
  },
  clearance: {
    title: '2. Clearance guide',
    sections: [
      {
        heading: 'Official information',
        intro: 'Students need to complete their academic, financial, library, laboratory, and administrative responsibilities before clearance can be completed.',
        subheading: 'Before completing your clearance:',
        items: [
          'Complete the required academic activities, assignments, projects, and examinations.',
          'Settle tuition fees, miscellaneous fees, and applicable penalties.',
          'Return borrowed library books, materials, and laboratory equipment.',
          'Settle any outstanding library or laboratory charges.',
          'Complete required university forms and administrative requirements.'
        ]
      },
      {
        subheading: 'For graduation clearance:',
        items: [
          'Complete all academic requirements of your program, including internship, thesis, or capstone project, if required.',
          'Make sure there are no outstanding school balances.',
          'Return borrowed materials or equipment and settle remaining fines.'
        ]
      }
    ],
    links: [
      { label: 'College Student Handbook (Clearance section)', url: 'https://adzu.edu.ph/wp-content/uploads/2026/02/ADZU-COLLEGE-STUDENT-HANDBOOK-2025.pdf' },
      { label: 'Office of Student Affairs (OSA) Programs and Services', url: 'https://adzu.edu.ph/osa-programs-and-services/' }
    ],
  },
  payment: {
    title: '3. Tuition & fees guide',
    sections: [
      {
        heading: 'Official information',
        intro: 'Your exact tuition and fees are shown in your official assessment. The total may vary depending on your program and enrolled subjects or units.',
        subheading: 'Before paying:',
        items: [
          'Check your official assessment for the total amount due.',
          'Review the tuition and other fees listed in your assessment.',
          'Follow the current payment instructions and deadlines from AdZU.',
          'Use the university’s authorized payment channels.',
          'Keep your official receipt or payment confirmation.'
        ]
      }
    ],
    links: [
      { label: 'AdZU Authorized Banks for Tuition Payments', url: 'https://adzu.edu.ph/adzu-authorized-banks-for-acceptance-of-tuition-payments/' }
    ],
  },
  scholarship: {
    title: '4. Scholarship guide',
    sections: [
      {
        heading: 'Official information',
        intro: 'The College Admissions and Aid Office accepts and processes scholarship applications.',
        subheading: 'Basic scholarship application requirements:',
        items: [
          'Completed scholarship application form',
          'Detailed personal statement explaining the need for a scholarship or financial aid',
          'Clear copy of the most recent Income Tax Return (ITR) of the applicant’s parents or guardians',
          'Copy of the applicant’s Senior High School report card',
          'Letter of recommendation from an Imam (for Muslims), Pastor (for non-Catholics), or Parish Priest (for Catholics)',
          'Detailed sketch of the applicant’s residence, including house number, street, and landmarks',
          'Copies of the latest electric bills or receipts for the past three months'
        ]
      },
      {
        subheading: 'Where to submit:',
        items: [
          'Submit the completed application and requirements to the College Admissions and Aid Office.',
          'You may also send the application to admissions@adzu.edu.ph.',
          'Attend an interview if one is scheduled by the office.'
        ]
      }
    ],
    links: [
      { label: 'Scholarship and Financial Grants', url: 'https://adzu.edu.ph/scholarship-and-financial-grants/' },
      { label: 'Scholarship Application Procedure', url: 'https://adzu.edu.ph/procedure-for-application/' },
      { label: 'College Scholarship Grant Application Form (PDF)', url: 'https://adzu.edu.ph/wp-content/uploads/2024/03/AdZU-Scholarship-Application-Form.pdf' },
      { label: 'College Admissions and Aid Office', url: 'https://adzu.edu.ph/about-us/admissions-aid/' }
    ],
  }
};

// Student-guide dialog presentation is handled by CSS. The scrollable content is
// intentionally kept separate from the close button so the X stays at top-right.
const guideDialog = document.getElementById('guideDialog');
const dialogTitle = document.getElementById('dialogTitle');
const dialogContent = document.getElementById('dialogContent');

document.querySelectorAll('[data-guide]').forEach(button => {
  button.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      dropdown.classList.remove('show');
      dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
    const guide = guideContent[button.dataset.guide];
    if (!guide) return;
    dialogTitle.textContent = guide.title;
    let guideHTML = '';
    guide.sections.forEach(section => {
      if (section.heading) guideHTML += '<h3 class="guide-subheading">' + section.heading + '</h3>';
      if (section.intro) guideHTML += '<p class="guide-intro">' + section.intro + '</p>';
      if (section.subheading) guideHTML += '<h4 class="guide-list-heading">' + section.subheading + '</h4>';
      if (section.items) guideHTML += '<ol class="guide-steps">' + section.items.map(item => '<li>' + item + '</li>').join('') + '</ol>';
    });
    if (guide.links) {
      guideHTML += '<h3 class="guide-subheading">Official links</h3><ul class="guide-links">' + guide.links.map(link => '<li><a href="' + link.url + '" target="_blank" rel="noopener noreferrer">' + link.label + ' ↗</a></li>').join('') + '</ul>';
    }
    dialogContent.innerHTML = guideHTML;
    document.getElementById('dialogNote').textContent = guide.note || '';
    guideDialog.showModal();
  });
});
document.getElementById('closeDialog').addEventListener('click', () => guideDialog.close());
document.getElementById('dialogDone').addEventListener('click', () => guideDialog.close());
guideDialog.addEventListener('click', event => {
  if (event.target === guideDialog) guideDialog.close();
});

// -----------------------------------------------------------------------------
// Browser-only admin demo
// -----------------------------------------------------------------------------
// Browser-only admin demo. This does not upload information to a server.
const STORAGE_KEY = 'adzuBuddyCustomPlaces';
const adminForm = document.getElementById('adminForm');
const adminMessage = document.getElementById('adminMessage');

function getCustomPlaces() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveCustomPlaces(places) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}
function renderCustomPlaces() {
  getCustomPlaces().forEach(place => {
    if (placeGrid.querySelector(`[data-custom-id="${place.id}"]`)) return;
    const card = document.createElement('article');
    card.className = 'place-card';
    card.dataset.category = place.category;
    card.dataset.search = (place.name + ' ' + place.description).toLowerCase();
    card.dataset.customId = place.id;
    const icon = place.category === 'office' ? '▤' : place.category === 'study' ? '▥' : '⌂';
    const label = place.category === 'office' ? 'OFFICE' : place.category === 'study' ? 'STUDY SPOT' : 'FACILITY';
    card.innerHTML = `
      <div class="place-art art-lounge"><span aria-hidden="true">${icon}</span></div>
      <div class="place-body">
        <span class="tag tag-blue">${label}</span>
        <h3></h3><p></p><div class="place-meta">Added in this browser demo</div>
      </div>`;
    card.querySelector('h3').textContent = place.name;
    card.querySelector('p').textContent = place.description;
    placeGrid.appendChild(card);
  });
  filterPlaces();
}
renderCustomPlaces();

adminForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('newPlaceName').value.trim();
  const category = document.getElementById('newPlaceCategory').value;
  const description = document.getElementById('newPlaceDescription').value.trim();
  if (!name || !description) return;
  const places = getCustomPlaces();
  places.push({ id: String(Date.now()) + Math.random().toString(16).slice(2), name, category, description });
  try {
    saveCustomPlaces(places);
    renderCustomPlaces();
    adminForm.reset();
    adminMessage.textContent = 'Directory item added to this browser.';
  } catch {
    adminMessage.textContent = 'Could not save. Your browser storage may be unavailable.';
  }
});


// Shared search helpers: normalize punctuation, spacing, and accented characters.
function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function searchMatches(haystack, query) {
  const normalizedHaystack = normalizeSearchText(haystack);
  const terms = normalizeSearchText(query).split(' ').filter(Boolean);
  return terms.every(term => normalizedHaystack.includes(term));
}

// Category selectors act as smooth-scroll navigation, keeping every item visible.
const orgCategory = document.getElementById('orgCategory');
const orgDirectory = document.getElementById('orgDirectory');

function scrollToOrganizationCategory() {
  if (!orgDirectory) return;
  const selected = orgCategory?.value || 'all';
  const target = selected === 'all'
    ? orgDirectory
    : [...orgDirectory.querySelectorAll('.org-cluster')].find(cluster =>
        normalizeSearchText(cluster.dataset.cluster || '') === normalizeSearchText(selected)
      );
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

orgCategory?.addEventListener('change', scrollToOrganizationCategory);

// Resource category selector scrolls to the first resource in that category.
const resourceCategory = document.getElementById('resourceCategory');
const resourceGrid = document.getElementById('resourceGrid');

function scrollToResourceCategory() {
  if (!resourceGrid) return;
  const selected = resourceCategory?.value || 'all';
  const target = selected === 'all'
    ? resourceGrid
    : [...resourceGrid.querySelectorAll('.resource-card')].find(card =>
        normalizeSearchText(card.dataset.category || '') === normalizeSearchText(selected)
      );
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

resourceCategory?.addEventListener('change', scrollToResourceCategory);
