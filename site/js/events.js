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
    container.innerHTML += `
      <div class="grid grid-cols-1 event-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <div class="p-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-blue-800 mb-4 leading-tight">${e.title ?? ''}</h3>
            <p class="text-lg font-semibold text-gray-600 leading-relaxed">${e.subtitle ?? ''}</p>
          </div>

          <div class="mb-8">
            <p class="text-gray-700 text-justify leading-relaxed">${e.summary ?? ''}</p>
          </div>

          <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center">
                <i data-feather="map-pin" class="w-5 h-5 mr-3 text-gray-400"></i>
                <span class="text-lg text-gray-600">${e.location ?? 'Sin ubicación'}</span>
              </div>

              <div class="bg-blue-800 text-white px-4 py-3 rounded-xl text-center min-w-[140px]">
                <div class="text-lg font-bold">${e.start_date ? new Date(e.start_date).toLocaleDateString() : ''}</div>
                <div class="text-xs opacity-75">Até</div>
                <div class="text-lg font-bold">${e.end_date ? new Date(e.end_date).toLocaleDateString() : ''}</div>
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