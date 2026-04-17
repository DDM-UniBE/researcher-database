/* ═══════════════════════════════════════════════════
   DDM Researcher Directory — App Logic
   ═══════════════════════════════════════════════════

   TO ADD A RESEARCHER:
   Edit data/researchers.json — add a new object to the array.

   Fields:
     initials   → 2-letter fallback shown when no photo
     photo      → path to image, e.g. "assets/headshots/name.jpg"
                  leave "" to show initials instead
     name       → full display name
     group      → research group shown on card
     institute  → institution(s) shown on card
     area       → research area (used by Research area filter)
     expertise  → expertise (used by Expertise filter)
     tag        → label on the red pill badge
     profileUrl → URL opened when clicking the card (opens in new tab)
   ═══════════════════════════════════════════════════ */

const arrowSVG = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.5 9h11M10 4.5l4.5 4.5L10 13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

let researchers = [];

/* ── Load data from JSON ── */
fetch('data/researchers.json')
  .then(res => res.json())
  .then(data => {
    researchers = data;
    renderGrid(researchers);
  })
  .catch(err => {
    console.error('Could not load researchers.json:', err);
    document.getElementById('grid').innerHTML =
      '<div class="no-results">Could not load researcher data.<br>Please run this page from a local server or hosting.</div>';
  });

/* ── Filter logic ── */
function applyFilters() {
  const q    = document.getElementById('searchInput').value.toLowerCase().trim();
  const area = document.getElementById('filterArea').value;
  const exp  = document.getElementById('filterExpertise').value;
  const inst = document.getElementById('filterInstitute').value;

  const filtered = researchers.filter(r =>
    (!q || r.name.toLowerCase().includes(q) ||
           r.group.toLowerCase().includes(q) ||
           r.tag.toLowerCase().includes(q) ||
           r.institute.toLowerCase().includes(q)) &&
    (!area || r.area.toLowerCase().includes(area.toLowerCase())) &&
    (!exp  || r.expertise.toLowerCase().includes(exp.toLowerCase())) &&
    (!inst || r.institute.toLowerCase().includes(inst.toLowerCase()))
  );
  renderGrid(filtered);
}

function clearFilters() {
  document.getElementById('searchInput').value     = '';
  document.getElementById('filterArea').value      = '';
  document.getElementById('filterExpertise').value = '';
  document.getElementById('filterInstitute').value = '';
  renderGrid(researchers);
}

/* ── Render cards ── */
function renderGrid(list) {
  const grid = document.getElementById('grid');
  document.getElementById('resultsMeta').innerHTML =
    `Showing <strong>${list.length}</strong> researcher${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = '<div class="no-results">No researchers match your search.<br>Try different keywords or clear the filters.</div>';
    return;
  }

  grid.innerHTML = list.map(r => {
    const photoEl = r.photo
      ? `<div class="card-photo"><img src="${r.photo}" alt="Photo of ${r.name}" /></div>`
      : `<div class="card-photo-initials">${r.initials}</div>`;

    return `
      <a class="card" href="${r.profileUrl}" target="_blank" role="listitem" aria-label="${r.name}, ${r.group}">
        <div class="card-head">
          <span class="card-tag">${r.tag}</span>
        </div>
        <div class="card-body">
          <div class="card-name">${r.name}</div>
          <div class="card-group">${r.group}</div>
          <div class="card-institute" style="margin-top:6px;">${r.institute}</div>
        </div>
        <div class="card-bottom">
          ${photoEl}
          <div class="card-arrow">${arrowSVG}</div>
        </div>
        <div class="card-cta">
          Want to join our research community?
          <a class="card-cta-link" href="https://ddm.unibe.ch/become_a_member/index_eng.html" target="_blank" onclick="event.stopPropagation()">
            Become a DDM Member →
          </a>
        </div>
      </a>`;
  }).join('');
}

/* ── Live search ── */
document.getElementById('searchInput').addEventListener('input', applyFilters);

/* ── Hamburger menu toggle ── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const greenNav     = document.getElementById('greenNav');
if (hamburgerBtn && greenNav) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = greenNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });
  greenNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      greenNav.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', false);
    });
  });
}

/* ── Mobile breadcrumb dropdown ── */
const breadcrumbToggle = document.getElementById('breadcrumbToggle');
const breadcrumbPanel  = document.getElementById('breadcrumbPanel');
if (breadcrumbToggle && breadcrumbPanel) {
  breadcrumbToggle.addEventListener('click', () => {
    const isOpen = breadcrumbPanel.classList.toggle('open');
    breadcrumbToggle.classList.toggle('open', isOpen);
    breadcrumbToggle.setAttribute('aria-expanded', isOpen);
  });
}

/* ── Mobile slide-up menu ── */
const mobileMenuBtn     = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose   = document.getElementById('mobileMenuClose');

function openMobileMenu() {
  mobileMenuOverlay.classList.add('open');
  mobileMenuOverlay.setAttribute('aria-hidden', false);
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileMenuOverlay.classList.remove('open');
  mobileMenuOverlay.setAttribute('aria-hidden', true);
  document.body.style.overflow = '';
}

if (mobileMenuBtn)   mobileMenuBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

// Close when a nav link is tapped
if (mobileMenuOverlay) {
  mobileMenuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
