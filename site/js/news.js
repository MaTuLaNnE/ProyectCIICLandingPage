async function loadNews() {
  console.log('loadNews arrancó');

  const container = document.getElementById('news-list');
  if (!container) {
    console.error('No existe #news-list');
    return;
  }

  if (!window.supabaseClient) {
    console.error('No existe supabaseClient');
    return;
  }

  const { data, error } = await window.supabaseClient
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  console.log('Respuesta news:', { data, error });

  if (error) {
    console.error('Error cargando noticias:', error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 py-12">No hay noticias disponibles.</p>';
    return;
  }

  container.innerHTML = '';

  data.forEach((n, index) => {
    const isFirst = index === 0;
    const date = n.published_at
      ? new Date(n.published_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    if (isFirst) {
      // Primera noticia: card grande destacada (hero)
      container.innerHTML += `
        <div class="col-span-full">
          <div class="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-white flex flex-col md:flex-row" style="min-height: 280px;">
            <div class="md:w-1/2 relative overflow-hidden" style="min-height: 220px;">
              <img 
                src="${n.image_url ?? ''}" 
                onerror="this.parentElement.style.background='linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)'; this.style.display='none';"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                style="min-height: 220px;"
              >
            </div>
            <div class="md:w-1/2 flex flex-col justify-center p-8">
              <span class="inline-block text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">Destacado</span>
              <h2 class="text-2xl font-bold text-blue-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                ${n.title ?? ''}
              </h2>
              <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">${n.summary ?? ''}</p>
              <div class="flex items-center gap-2 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                ${date}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Resto: cards compactas con imagen y hover elegante
      container.innerHTML += `
        <div class="group cursor-pointer">
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            
            <div class="relative overflow-hidden" style="height: 180px; background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);">
              <img 
                src="${n.image_url ?? ''}"
                onerror="this.style.display='none';"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              >
              <!-- Gradient overlay sutil -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div class="p-5 flex flex-col flex-1">
              <h3 class="text-base font-bold text-blue-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                ${n.title ?? ''}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">${n.summary ?? ''}</p>
              <div class="flex items-center gap-1.5 text-gray-400 text-xs mt-4 pt-4 border-t border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                ${date}
              </div>
            </div>

          </div>
        </div>
      `;
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadNews();
});