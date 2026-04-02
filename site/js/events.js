// 

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

  console.log('Consultando tabla events...');

  const { data, error } = await window.supabaseClient
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });

  console.log('Respuesta de Supabase:', { data, error });

  if (error) {
    console.error('Error cargando eventos:', error);
    container.innerHTML = `<p class="text-red-600">Error cargando eventos: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No hay eventos cargados.</p>';
    return;
  }

  container.innerHTML = '';

  data.forEach((e) => {
    const start = e.start_date ? new Date(e.start_date).toLocaleDateString() : '';
    const end = e.end_date ? new Date(e.end_date).toLocaleDateString() : '';

    const dateDisplay = start === end
      ? start
      : `${start} <span class="text-slate-500 text-sm mx-1">até</span> ${end}`;

    container.innerHTML += `
      <div class="event-card bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <div class="p-6 flex flex-col h-full">
          
          <div class="mb-4">
            <h3 class="text-xl md:text-2xl font-bold text-blue-800 leading-snug mb-2">
              ${e.title ?? ''}
            </h3>
            <p class="text-base md:text-lg font-medium text-slate-600">
              ${e.subtitle ?? ''}
            </p>
          </div>

          <div class="mb-5">
            <p class="text-slate-600 leading-7 text-sm md:text-base">
              ${e.summary ?? ''}
            </p>
          </div>

          <div class="pt-4 border-t border-gray-100 mt-auto">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              <div class="flex items-center text-slate-600 min-w-0">
                <i data-feather="map-pin" class="w-4 h-4 mr-2 text-slate-400 shrink-0"></i>
                <span class="text-sm md:text-base leading-snug">
                  ${e.location ?? 'Virtual'}
                </span>
              </div>

              <div class="bg-green-100 border border-slate-200 rounded-lg px-4 py-3 text-center min-w-[130px] sm:min-w-[145px]">
                <div class="text-[11px] uppercase tracking-wide text-slate-500 mb-1 font-semibold">
                  Data
                </div>
                <div class="text-base font-semibold text-slate-800 whitespace-nowrap">
                  ${dateDisplay}
                </div>
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
  console.log('DOMContentLoaded disparado');
  loadEvents();
});


// Back to top button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  const backToTopBtn = document.getElementById("backToTop");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    backToTopBtn.classList.remove('hidden');
  } else {
    backToTopBtn.classList.add('hidden');
  }
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}