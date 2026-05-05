async function loadEvents() {
  console.log('loadEvents arrancó');

  const container = document.getElementById('events-list');
  if (!container) {
    console.error('No existe #events-list');
    return;
  }

  if (!window.supabaseClient) {
    console.error('No existe window.supabaseClient');
    container.innerHTML = '<p class="text-red-600">Error: Supabase no inicializado</p>';
    return;
  }

  const { data, error } = await window.supabaseClient
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    container.innerHTML = `<p class="text-red-600">Error cargando eventos: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No hay eventos cargados.</p>';
    return;
  }

  container.innerHTML = '';

  data.forEach((e) => {
    const fmt = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '';
    const start = fmt(e.start_date);
    const end = fmt(e.end_date);

    const dateDisplay = !end || start === end
      ? `<span class="text-sm font-semibold text-slate-700 whitespace-nowrap">${start}</span>`
      : `<span class="text-sm font-semibold text-slate-700 whitespace-nowrap">${start}</span>
          <span class="text-xs text-slate-400 mx-1">→</span>
         <span class="text-sm font-semibold text-slate-700 whitespace-nowrap">${end}</span>`;

    container.innerHTML += `
      <div class="event-card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div class="p-4 flex flex-col gap-2">

          <div>
            <h3 class="text-base font-bold text-blue-800 leading-snug">
              ${e.title ?? ''}
            </h3>
            <p class="text-sm font-medium text-slate-500 mt-0.5">
              ${e.subtitle ?? ''}
            </p>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed line-clamp-3">
            ${e.summary ?? ''}
          </p>


          <div class="flex flex-col gap-2 pt-2 border-t border-gray-100 mt-1">

          <div class="flex items-center gap-1.5 text-slate-500 min-w-0">
            <i data-feather="map-pin" class="w-3.5 h-3.5 shrink-0 text-slate-400"></i>
            <span class="text-xs">${e.location ?? 'Virtual'}</span>
          </div>

          <div class="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 self-start">
            <i data-feather="calendar" class="w-3.5 h-3.5 text-green-600 shrink-0"></i>
            <div class="flex items-center gap-0.5 flex-wrap">
              ${dateDisplay}
            </div>
          </div>

        </div>





        </div>
      </div>
    `;
  });

  feather.replace();
}

window.addEventListener('DOMContentLoaded', () => {
  loadEvents();
});

window.onscroll = function () { scrollFunction(); };

function scrollFunction() {
  const btn = document.getElementById("backToTop");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btn.classList.remove('hidden');
  } else {
    btn.classList.add('hidden');
  }
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}