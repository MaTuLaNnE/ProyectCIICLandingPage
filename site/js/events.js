async function loadEvents() {
  console.log('loadEvents arrancó');

  const container = document.getElementById('events-list');
  if (!container) { console.error('No existe #events-list'); return; }
  if (!window.supabaseClient) {
    console.error('No existe window.supabaseClient');
    container.innerHTML = '<p class="text-red-600">Error: Supabase no inicializado</p>';
    return;
  }

  const { data, error } = await window.supabaseClient
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });

  console.log('Respuesta de Supabase:', { data, error });

  if (error) {
    console.error('Error cargando eventos:', error);
    container.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No hay eventos cargados.</p>';
    return;
  }

  // ── Carrusel: últimos 3 ──────────────────────────────────────────────────
  buildCarousel(data.slice(0, 3));

  // ── Grilla: todos ────────────────────────────────────────────────────────
  container.innerHTML = '';
  data.forEach(e => {
    const { dateDisplay } = formatDates(e);
    container.innerHTML += `
      <div class="event-card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <div class="p-6 flex flex-col h-full">
          <div class="mb-4">
            <h3 class="text-xl md:text-2xl font-bold text-blue-800 leading-snug mb-2">${e.title ?? ''}</h3>
            <p class="text-base md:text-lg font-medium text-slate-600">${e.subtitle ?? ''}</p>
          </div>
          <div class="mb-5">
            <p class="text-slate-600 leading-7 text-sm md:text-base">${e.summary ?? ''}</p>
          </div>
          <div class="pt-4 border-t border-gray-100 mt-auto">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center text-slate-600 min-w-0">
                <i data-feather="map-pin" class="w-4 h-4 mr-2 text-slate-400 shrink-0"></i>
                <span class="text-sm md:text-base leading-snug">${e.location ?? 'Virtual'}</span>
              </div>
              <div class="bg-green-100 border border-slate-200 rounded-lg px-4 py-3 text-center min-w-[130px] sm:min-w-[145px]">
                <div class="text-[11px] uppercase tracking-wide text-slate-500 mb-1 font-semibold">Data</div>
                <div class="text-base font-semibold text-slate-800 whitespace-nowrap">${dateDisplay}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });

  feather.replace();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDates(e) {
  const locale = 'es-UY';
  const opts   = { day: 'numeric', month: 'long', year: 'numeric' };
  const start  = e.start_date ? new Date(e.start_date).toLocaleDateString(locale, opts) : '';
  const end    = e.end_date   ? new Date(e.end_date).toLocaleDateString(locale, opts)   : '';
  const startShort = e.start_date ? new Date(e.start_date).toLocaleDateString() : '';
  const endShort   = e.end_date   ? new Date(e.end_date).toLocaleDateString()   : '';
  return {
    dateDisplay: startShort === endShort
      ? startShort
      : `${startShort} <span class="text-slate-500 text-sm mx-1">até</span> ${endShort}`,
    startLong: start,
    endLong: end,
  };
}

// ── Carrusel ──────────────────────────────────────────────────────────────────
function buildCarousel(items) {
  const track         = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !dotsContainer) return;

  let current = 0;
  const total = items.length;

  track.innerHTML = items.map(e => {
    const { startLong, endLong } = formatDates(e);
    const dateLabel = startLong === endLong || !endLong
      ? startLong
      : `${startLong} — ${endLong}`;

    return `
      <div class="carousel-slide w-full flex-shrink-0 px-4 md:px-16">
        <div class="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-100">

          <!-- Columna izquierda: fecha destacada -->
          <div class="md:w-2/5 bg-blue-800 flex flex-col items-center justify-center p-8 text-white text-center flex-shrink-0">
            <i data-feather="calendar" class="w-10 h-10 mb-4 opacity-70"></i>
            <p class="text-sm uppercase tracking-widest opacity-70 mb-2">Fecha</p>
            <p class="text-lg font-bold leading-snug">${dateLabel || 'Por confirmar'}</p>
            ${e.location ? `
            <div class="mt-6 flex items-center gap-2 opacity-80">
              <i data-feather="map-pin" class="w-4 h-4 flex-shrink-0"></i>
              <span class="text-sm">${e.location}</span>
            </div>` : ''}
          </div>

          <!-- Columna derecha: info -->
          <div class="p-6 md:p-8 flex flex-col justify-center md:w-3/5">
            <span class="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Evento</span>
            <h3 class="text-xl md:text-2xl font-bold text-blue-900 mb-2 leading-tight">${e.title ?? ''}</h3>
            ${e.subtitle ? `<p class="text-base font-medium text-slate-500 mb-3">${e.subtitle}</p>` : ''}
            <p class="text-gray-500 text-sm md:text-base line-clamp-3">${e.summary ?? ''}</p>
          </div>

        </div>
      </div>`;
  }).join('');

  // Dots
  dotsContainer.innerHTML = items.map((_, i) => `
    <button data-i="${i}"
      class="carousel-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-blue-800 scale-125' : 'bg-gray-300'}">
    </button>`).join('');

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('bg-blue-800', i === current);
      d.classList.toggle('scale-125',   i === current);
      d.classList.toggle('bg-gray-300', i !== current);
    });
    feather.replace(); // re-render íconos en el slide activo
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => goTo(current + 1));
  dotsContainer.addEventListener('click', e => {
    const i = e.target.dataset.i;
    if (i !== undefined) goTo(Number(i));
  });

  // Autoplay
  let timer = setInterval(() => goTo(current + 1), 5000);
  const wrapper = document.getElementById('carousel-wrapper');
  wrapper?.addEventListener('mouseenter', () => clearInterval(timer));
  wrapper?.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 5000); });

  feather.replace();
}

// ── Back to top ───────────────────────────────────────────────────────────────
window.onscroll = function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.classList.toggle('hidden', document.documentElement.scrollTop <= 300);
};

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded disparado');
  loadEvents();
});