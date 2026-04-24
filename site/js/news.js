async function loadNews() {
  console.log('loadNews arrancó');

  const container = document.getElementById('news-list');
  if (!container) { console.error('No existe #news-list'); return; }
  if (!window.supabaseClient) { console.error('No existe supabaseClient'); return; }

  const { data, error } = await window.supabaseClient
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  console.log('Respuesta news:', { data, error });
  if (error) { console.error('Error cargando noticias:', error); return; }
  if (!data || data.length === 0) {
    container.innerHTML = '<p>No hay noticias</p>';
    return;
  }

  // ── Carrusel: últimas 3 ──────────────────────────────────────────────────
  const latest = data.slice(0, 3);
  buildCarousel(latest);

  // ── Grilla: todas ────────────────────────────────────────────────────────
  container.innerHTML = '';
  data.forEach(n => {
    container.innerHTML += `
      <div class="max-w-md mx-auto">
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <img src="${n.image_url ?? 'https://via.placeholder.com/150'}"
               class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-xl font-bold text-blue-800">${n.title ?? ''}</h3>
            <p class="text-gray-600 mt-4">${n.summary ?? ''}</p>
            <p class="text-gray-400 text-sm mt-4">
              ${n.published_at ? new Date(n.published_at).toLocaleDateString() : ''}
            </p>
          </div>
        </div>
      </div>`;
  });
}

// ── Carrusel ─────────────────────────────────────────────────────────────────
function buildCarousel(items) {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !dotsContainer) return;

  let current = 0;
  const total = items.length;

  // Cards
  track.innerHTML = items.map(n => `
  <div class="carousel-slide w-full flex-shrink-0 px-2 md:px-8">
    <div class="relative rounded-2xl overflow-hidden max-w-4xl mx-auto" style="height: 420px;">

      <!-- Imagen de fondo -->
      <img
        src="${n.image_url ?? 'https://via.placeholder.com/1200x600'}"
        alt="${n.title ?? ''}"
        class="w-full h-full object-cover"
      >

      <!-- Gradiente sobre la imagen -->
      <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,20,70,0.82) 0%, rgba(0,20,70,0.3) 50%, transparent 100%);"></div>

      <!-- Texto sobre la imagen, abajo -->
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <span class="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-2 block">
          ${n.published_at ? new Date(n.published_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
        </span>
        <h3 class="text-xl md:text-3xl font-bold text-white leading-tight drop-shadow">
          ${n.title ?? ''}
        </h3>
      </div>

    </div>
  </div>
`).join('');

  // Dots
  dotsContainer.innerHTML = items.map((_, i) => `
    <button data-i="${i}"
      class="carousel-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-blue-800 scale-125' : 'bg-gray-300'}">
    </button>
  `).join('');

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('bg-blue-800', i === current);
      d.classList.toggle('scale-125', i === current);
      d.classList.toggle('bg-gray-300', i !== current);
    });
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => goTo(current + 1));
  dotsContainer.addEventListener('click', e => {
    const i = e.target.dataset.i;
    if (i !== undefined) goTo(Number(i));
  });

  // Autoplay cada 5 s
  let timer = setInterval(() => goTo(current + 1), 5000);
  const wrapper = document.getElementById('carousel-wrapper');
  wrapper?.addEventListener('mouseenter', () => clearInterval(timer));
  wrapper?.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 5000); });
}

window.addEventListener('DOMContentLoaded', () => loadNews());