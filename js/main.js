const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const backTop = document.querySelector('.back-top');
const toast = document.querySelector('.toast');

if (menuToggle && header) {
  menuToggle.addEventListener('click', () => {
    header.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (icon) icon.className = header.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
}

const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
});

window.addEventListener('scroll', () => {
  if (!backTop) return;
  backTop.classList.toggle('show', window.scrollY > 480);
});
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

function showToast(message) {
  if (!toast) return alert(message);
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateCartCount(increment = 1) {
  document.querySelectorAll('.cart-count').forEach(count => {
    count.textContent = String(Number(count.textContent || 0) + increment);
  });
}

document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    updateCartCount(1);
    showToast('Added to cart successfully');
  });
});

document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    showToast('Thanks for subscribing!');
    if (input) input.value = '';
  });
});

document.querySelectorAll('.contact-form, .auth-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast(form.classList.contains('auth-form') ? 'Form submitted successfully' : 'Message sent successfully');
  });
});

const mainPhoto = document.querySelector('.main-photo img');
document.querySelectorAll('.thumbs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.thumbs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (mainPhoto) mainPhoto.src = btn.querySelector('img').src;
  });
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const content = document.querySelector(`[data-content="${target}"]`);
    if (content) content.classList.add('active');
  });
});

document.querySelectorAll('.qty').forEach(qty => {
  const input = qty.querySelector('input');
  qty.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      let value = Number(input.value || 1);
      if (button.dataset.qty === 'minus') value = Math.max(1, value - 1);
      if (button.dataset.qty === 'plus') value += 1;
      input.value = value;
    });
  });
});

// Product and blog filters + search + sorting
function initCardsFilter(config) {
  const grid = document.querySelector(config.grid);
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(config.card));
  const tags = Array.from(document.querySelectorAll(config.tags));
  const searchInput = document.querySelector(config.search || '');
  const sortSelect = document.querySelector(config.sort || '');
  const urlQuery = new URLSearchParams(location.search).get('q') || '';

  if (!cards.length) return;

  let activeFilter = 'all';
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i><h3>No results found</h3><p>Try another category or search keyword.</p>`;
  grid.appendChild(empty);

  function applyFilter() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(',').map(item => item.trim()).filter(Boolean);
      const text = card.textContent.toLowerCase();
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = !query || text.includes(query);
      const isVisible = matchesFilter && matchesSearch;
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    empty.classList.toggle('show', visibleCount === 0);
  }

  function applySort() {
    if (!sortSelect) return;
    const value = sortSelect.value;
    const sorted = [...cards];

    if (value === 'price-low') {
      sorted.sort((a, b) => Number(a.dataset.price || 0) - Number(b.dataset.price || 0));
    } else if (value === 'price-high') {
      sorted.sort((a, b) => Number(b.dataset.price || 0) - Number(a.dataset.price || 0));
    } else if (value === 'newest') {
      sorted.sort((a, b) => Number(b.dataset.date || 0) - Number(a.dataset.date || 0));
    } else {
      sorted.sort((a, b) => Number(a.dataset.order || 0) - Number(b.dataset.order || 0));
    }

    sorted.forEach(card => grid.insertBefore(card, empty));
  }

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(item => item.classList.remove('active'));
      tag.classList.add('active');
      activeFilter = tag.dataset.filter || 'all';
      applyFilter();
    });
  });

  if (searchInput) {
    if (urlQuery) searchInput.value = urlQuery;
    searchInput.addEventListener('input', applyFilter);
  }
  if (sortSelect) sortSelect.addEventListener('change', () => { applySort(); applyFilter(); });

  applySort();
  applyFilter();
}

initCardsFilter({
  grid: '.products-grid.big',
  card: '.product-card',
  tags: '.product-filter .tag',
  search: '.product-search',
  sort: '.product-sort'
});

initCardsFilter({
  grid: '.blog-grid',
  card: '.blog-card',
  tags: '.blog-filter .tag',
  search: '.blog-search'
});

// Global search panel
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const searchClose = document.querySelector('.search-close');
const searchInputGlobal = document.querySelector('.search-global-input');
const searchResults = document.querySelector('.search-results');
const searchChips = document.querySelectorAll('.search-chip');

// Cart drawer
const cartToggle = document.querySelector('.cart-toggle');
const cartPanel = document.querySelector('.cart-panel');
const cartClose = document.querySelector('.cart-close');

const siteIndex = [
  { title: 'Home', type: 'Page', text: 'Fresh premium apples homepage orchard hero benefits', href: 'index.html', icon: 'fa-house' },
  { title: 'Products', type: 'Page', text: 'All fresh apples products red green gift box', href: 'products.html', icon: 'fa-basket-shopping' },
  { title: 'Blogs', type: 'Page', text: 'Blog recipes tips farming health articles', href: 'blogs.html', icon: 'fa-newspaper' },
  { title: 'Contact Us', type: 'Page', text: 'Contact support location email phone', href: 'contact.html', icon: 'fa-headset' },
  { title: 'Red Delicious', type: 'Product', text: 'red delicious apple crisp sweet juicy premium', href: 'products.html?q=Red%20Delicious', image: 'assets/images/apple-red-delicious.jpg' },
  { title: 'Fuji Apple', type: 'Product', text: 'fuji apple sweet crunchy fresh', href: 'products.html?q=Fuji%20Apple', image: 'assets/images/apple-fuji.jpg' },
  { title: 'Granny Smith', type: 'Product', text: 'granny smith green apple tangy refreshing', href: 'products.html?q=Granny%20Smith', image: 'assets/images/apple-granny.jpg' },
  { title: 'Gala Apple', type: 'Product', text: 'gala apple mild sweet aromatic', href: 'products.html?q=Gala%20Apple', image: 'assets/images/apple-gala.jpg' },
  { title: 'Honeycrisp', type: 'Product', text: 'honeycrisp apple juicy crisp red premium', href: 'products.html?q=Honeycrisp', image: 'assets/images/apple-honeycrisp.jpg' },
  { title: 'Golden Delicious', type: 'Product', text: 'golden delicious green golden apple soft fragrant', href: 'products.html?q=Golden%20Delicious', image: 'assets/images/apple-golden.jpg' },
  { title: 'Apple Gift Box', type: 'Product', text: 'gift box mixed apples premium basket orchard', href: 'products.html?q=Gift%20Box', image: 'assets/images/orchard-crate.jpg' },
  { title: 'The Benefits of Eating Apples Daily', type: 'Article', text: 'health nutrition benefits eating apples daily fiber antioxidants', href: 'blogs.html?q=Benefits', image: 'assets/images/blog-benefits.jpg' },
  { title: 'How We Grow Premium Apples', type: 'Article', text: 'farming tips grow premium apples sustainable orchard', href: 'blogs.html?q=Grow', image: 'assets/images/blog-grow.jpg' },
  { title: 'Apple Recipes You’ll Love', type: 'Article', text: 'recipes pie dessert apple recipes', href: 'blogs.html?q=Recipes', image: 'assets/images/blog-recipes.jpg' },
  { title: 'Why Freshness Matters', type: 'Article', text: 'news freshness matters farm produce delivery', href: 'blogs.html?q=Freshness', image: 'assets/images/blog-freshness.jpg' },
  { title: 'Best Apples for Baking', type: 'Article', text: 'baking recipes best apples for baking pie', href: 'blogs.html?q=Baking', image: 'assets/images/blog-baking.jpg' },
  { title: 'Supporting Local Farmers', type: 'Article', text: 'local farmers sustainability community support', href: 'blogs.html?q=Farmers', image: 'assets/images/blog-farmers.jpg' }
];

function closeHeaderPanels() {
  if (!header) return;
  header.classList.remove('search-open', 'cart-open');
  searchPanel?.setAttribute('aria-hidden', 'true');
  cartPanel?.setAttribute('aria-hidden', 'true');
}

function openSearchPanel() {
  if (!header || !searchPanel) return;
  header.classList.remove('cart-open');
  header.classList.add('search-open');
  searchPanel.setAttribute('aria-hidden', 'false');
  cartPanel?.setAttribute('aria-hidden', 'true');
  renderSearchResults(searchInputGlobal?.value || '');
  setTimeout(() => searchInputGlobal?.focus(), 120);
}

function openCartPanel() {
  if (!header || !cartPanel) return;
  header.classList.remove('search-open');
  header.classList.add('cart-open');
  cartPanel.setAttribute('aria-hidden', 'false');
  searchPanel?.setAttribute('aria-hidden', 'true');
}

function renderSearchResults(query = '') {
  if (!searchResults) return;
  const normalized = query.trim().toLowerCase();
  let results = [];

  if (!normalized) {
    results = siteIndex.slice(4, 10);
  } else {
    results = siteIndex.filter(item => `${item.title} ${item.text} ${item.type}`.toLowerCase().includes(normalized));
  }

  if (!results.length) {
    searchResults.innerHTML = `<div class="search-empty"><i class="fa-solid fa-magnifying-glass"></i><strong>No results for “${query}”</strong><p>Try another keyword like apples, recipes, delivery or gift box.</p></div>`;
    return;
  }

  searchResults.innerHTML = results.slice(0, 8).map(item => `
    <a class="search-result" href="${item.href}">
      ${item.image ? `<img class="search-result-thumb" src="${item.image}" alt="${item.title}">` : `<span class="search-result-icon"><i class="fa-solid ${item.icon || 'fa-circle'}"></i></span>`}
      <div>
        <span class="search-meta">${item.type}</span>
        <h4>${item.title}</h4>
        <p>${item.text.split(' ').slice(0, 8).join(' ')}...</p>
      </div>
    </a>
  `).join('');
}

if (searchToggle && searchPanel) {
  searchToggle.addEventListener('click', e => {
    e.preventDefault();
    header.classList.contains('search-open') ? closeHeaderPanels() : openSearchPanel();
  });
}
if (cartToggle && cartPanel) {
  cartToggle.addEventListener('click', e => {
    e.preventDefault();
    header.classList.contains('cart-open') ? closeHeaderPanels() : openCartPanel();
  });
}
if (searchClose) searchClose.addEventListener('click', closeHeaderPanels);
if (cartClose) cartClose.addEventListener('click', closeHeaderPanels);

if (searchInputGlobal) {
  searchInputGlobal.addEventListener('input', e => renderSearchResults(e.target.value));
  searchInputGlobal.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = searchInputGlobal.value.trim();
      if (!value) return;
      const first = siteIndex.find(item => `${item.title} ${item.text}`.toLowerCase().includes(value.toLowerCase()));
      if (first) {
        location.href = first.href.includes('?') ? first.href : `${first.href}?q=${encodeURIComponent(value)}`;
      } else {
        location.href = `products.html?q=${encodeURIComponent(value)}`;
      }
    }
    if (e.key === 'Escape') closeHeaderPanels();
  });
}

document.querySelectorAll('.search-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const value = chip.dataset.query || '';
    if (searchInputGlobal) searchInputGlobal.value = value;
    renderSearchResults(value);
    openSearchPanel();
  });
});

document.addEventListener('click', e => {
  if (!header || (!header.classList.contains('search-open') && !header.classList.contains('cart-open'))) return;
  if (e.target.closest('.search-panel') || e.target.closest('.cart-panel') || e.target.closest('.search-toggle') || e.target.closest('.cart-toggle')) return;
  closeHeaderPanels();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeHeaderPanels();
    if (header?.classList.contains('open')) menuToggle?.click();
  }
});

renderSearchResults('');
