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
    container.innerHTML = '<p>No hay noticias</p>';
    return;
  }

  container.innerHTML = '';

  data.forEach(n => {
    container.innerHTML += `
      <div class="max-w-md mx-auto">
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <img src="${n.image_url ?? 'https://via.placeholder.com/150'}" class="w-full h-48 object-cover">

          <div class="p-4">
            <h3 class="text-xl font-bold text-blue-800">${n.title ?? ''}</h3>
            <p class="text-gray-600 mt-4">${n.summary ?? ''}</p>
            <p class="text-gray-400 text-sm mt-4">
              ${n.published_at ? new Date(n.published_at).toLocaleDateString() : ''}
            </p>
          </div>
        </div>
      </div>
    `;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadNews();
});
