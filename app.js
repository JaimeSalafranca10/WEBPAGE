function getCatalogItems() {
  return Array.isArray(window.SETTO_CATALOG_ITEMS) ? window.SETTO_CATALOG_ITEMS : [];
}

function getCategoryLabel(category) {
  const labels = {
    estructuras: 'Estructuras premium',
    asientos: 'Asientos versátiles',
    mobiliario: 'Mobiliario funcional',
    ambiente: 'Soluciones de ambiente',
  };

  return labels[category] || 'Selección profesional';
}

function getProductHighlights(item) {
  const baseHighlights = [
    'Selección preparada para eventos corporativos, sociales y producciones especiales.',
    'Logística coordinada para montaje, retirada y adaptación al espacio.',
    'Asesoramiento rápido para definir cantidades, combinaciones y tiempos de entrega.',
  ];

  const categoryHighlights = {
    estructuras: [
      'Ideal para cubrir zonas exteriores, recepciones y áreas de apoyo.',
      'Solución estable y visualmente limpia para eventos con alto tránsito.',
    ],
    asientos: [
      'Pensado para configuraciones de alto volumen con una imagen uniforme.',
      'Perfecto para salas, terrazas, banquetes y formatos de presentación.',
    ],
    mobiliario: [
      'Aporta estructura y funcionalidad a banquetes, zonas de trabajo y hospitality.',
      'Se integra con facilidad en montajes sobrios, cálidos o corporativos.',
    ],
    ambiente: [
      'Diseñado para mejorar confort, sonido y experiencia de uso durante el evento.',
      'Complemento clave para exteriores, zonas de servicio y producciones completas.',
    ],
  };

  return [...baseHighlights, ...(categoryHighlights[item.category] || [])].slice(0, 4);
}

function getCatalogItemLink(item) {
  return `item.html?ref=${encodeURIComponent(item.ref)}`;
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const items = getCatalogItems();

  if (!grid || !items.length) return;

  grid.innerHTML = items.map((item) => `
    <a class="cat-card" href="${getCatalogItemLink(item)}" aria-label="Abrir ficha de ${item.name}" data-category="${item.category}">
      <div class="cat-card-img">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cat-card-overlay"><span class="cat-card-cta">Ver ficha</span></div>
      </div>
      <div class="cat-card-info">
        <p class="cat-card-ref">${item.label} · Ref. ${item.ref}</p>
        <p class="cat-card-name">${item.name}</p>
      </div>
    </a>
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

function renderProductDetail() {
  const mount = document.getElementById('productDetail');
  const items = getCatalogItems();

  if (!mount || !items.length) return;

  const params = new URLSearchParams(window.location.search);
  const requestedRef = params.get('ref');
  const requestedIndex = items.findIndex((item) => item.ref === requestedRef);
  const activeIndex = requestedIndex >= 0 ? requestedIndex : 0;
  const item = items[activeIndex];

  if (!item) {
    mount.innerHTML = `
      <section class="product-page product-page-empty">
        <p class="product-kicker">Catálogo SETTO</p>
        <h1 class="product-title">Ficha no disponible</h1>
        <p class="product-copy">No hemos podido localizar el producto solicitado. Vuelve al catálogo para explorar la selección completa.</p>
        <a class="page-link" href="catalogo.html">Volver al catálogo →</a>
      </section>
    `;
    return;
  }

  const previousItem = items[(activeIndex - 1 + items.length) % items.length];
  const nextItem = items[(activeIndex + 1) % items.length];
  const relatedItems = items
    .filter((candidate) => candidate.category === item.category && candidate.ref !== item.ref)
    .slice(0, 3);
  const highlights = getProductHighlights(item);

  mount.innerHTML = `
    <section class="product-page">
      <div class="product-hero">
        <div class="product-copy-block">
          <p class="product-kicker">${getCategoryLabel(item.category)}</p>
          <h1 class="product-title">${item.name}</h1>
          <p class="product-subtitle">${item.label} · Ref. ${item.ref}</p>
          <p class="product-copy">${item.description}</p>
          <div class="product-actions">
            <a class="page-link" href="contacto.html">Solicitar presupuesto →</a>
            <a class="product-secondary-link" href="catalogo.html">Volver al catálogo</a>
          </div>
        </div>

        <div class="product-media">
          <img src="${item.image}" alt="${item.name}" />
        </div>
      </div>

      <div class="product-detail-grid">
        <article class="product-panel">
          <h2>Información clave</h2>
          <dl class="product-specs">
            <div><dt>Categoría</dt><dd>${item.label}</dd></div>
            <div><dt>Referencia</dt><dd>${item.ref}</dd></div>
            <div><dt>Estilo</dt><dd>${getCategoryLabel(item.category)}</dd></div>
            <div><dt>Uso recomendado</dt><dd>${item.category === 'ambiente' ? 'Confort y soporte técnico' : 'Eventos y montajes profesionales'}</dd></div>
          </dl>
        </article>

        <article class="product-panel">
          <h2>Resumen operativo</h2>
          <p>${item.description}</p>
          <ul class="product-list">
            ${highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
          </ul>
        </article>

        <article class="product-panel product-nav-panel">
          <h2>Avanza entre fichas</h2>
          <div class="product-nav-links">
            <a class="product-nav-link" href="${getCatalogItemLink(previousItem)}">
              <span>Anterior</span>
              <strong>${previousItem.name}</strong>
            </a>
            <a class="product-nav-link" href="${getCatalogItemLink(nextItem)}">
              <span>Siguiente</span>
              <strong>${nextItem.name}</strong>
            </a>
          </div>
        </article>
      </div>

      <section class="related-section">
        <div class="section-head">
          <p class="product-kicker">Más opciones de la misma línea</p>
          <h2>Productos relacionados</h2>
        </div>
        <div class="related-grid">
          ${relatedItems.length ? relatedItems.map((related) => `
            <a class="related-card" href="${getCatalogItemLink(related)}">
              <img src="${related.image}" alt="${related.name}" />
              <div>
                <p>${related.label} · Ref. ${related.ref}</p>
                <strong>${related.name}</strong>
              </div>
            </a>
          `).join('') : '<p class="related-empty">No hay productos relacionados en esta categoría.</p>'}
        </div>
      </section>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  initCatalogFilters();
  initLightbox();
  renderProductDetail();

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