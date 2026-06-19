function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const items = window.SETTO_CATALOG_ITEMS;

  if (!grid || !Array.isArray(items) || !items.length) return;

  grid.innerHTML = items.map((item) => `
    <div class="cat-card" tabindex="0" role="button" data-lightbox data-category="${item.category}" data-img="${item.image}" data-ref="${item.label} · Ref. ${item.ref}" data-name="${item.name}" data-desc="${item.description}">
      <div class="cat-card-img">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cat-card-overlay"><span class="cat-card-cta">Ver detalle</span></div>
      </div>
      <div class="cat-card-info">
        <p class="cat-card-ref">${item.label}</p>
        <p class="cat-card-name">${item.name}</p>
      </div>
    </div>
  `).join('');
}

function initCatalogFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');

  if (!filterButtons.length || !cards.length) return;

  const setFilter = (category, button) => {
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    cards.forEach((card) => {
      card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter, button));
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbRef = document.getElementById('lbRef');
  const lbName = document.getElementById('lbName');
  const lbDesc = document.getElementById('lbDesc');
  const cards = document.querySelectorAll('[data-lightbox]');

  if (!lightbox || !lbImg || !lbRef || !lbName || !lbDesc || !cards.length) return;

  const closeLightbox = () => {
    lightbox.classList.remove('open');
  };

  const openLightbox = (card) => {
    lbImg.src = card.dataset.img || '';
    lbImg.alt = card.dataset.name || '';
    lbRef.textContent = card.dataset.ref || '';
    lbName.textContent = card.dataset.name || '';
    lbDesc.textContent = card.dataset.desc || '';
    lightbox.classList.add('open');
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.querySelectorAll('[data-lightbox-close]').forEach((button) => {
    button.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  initCatalogFilters();
  initLightbox();

  // --- NUEVA LÓGICA PARA ASENTOS POR DEFECTO ---
  // 1. Buscamos el botón de asientos y todas las tarjetas creadas
  const defaultButton = document.querySelector('[data-filter="asientos"]');
  const cards = document.querySelectorAll('[data-category]');

  if (defaultButton && cards.length) {
    // 2. Marcamos visualmente el botón de asientos como activo
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach((item) => item.classList.toggle('active', item === defaultButton));

    // 3. Ocultamos las tarjetas que no correspondan a "asientos"
    cards.forEach((card) => {
      card.classList.toggle('hidden', card.dataset.category !== 'asientos');
    });
  }
});