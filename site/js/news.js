async function loadNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error cargando noticias:', error);
    return;
  }

  const container = document.getElementById('news-list');
  container.innerHTML = '';

  data.forEach(n => {
    container.innerHTML += `
      <div class="max-w-md mx-auto">
        <div class="grid grid-cols-1 event-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <img src="${n.image_url ?? 'https://via.placeholder.com/150'}" alt="Noticia CIIC" class="w-full h-48 object-cover">

          <div class="p-4 flex flex-col">
            <h3 class="text-xl font-bold text-blue-800">${n.title ?? ''}</h3>
            <p class="text-gray-600 mt-6">${n.summary ?? ''}</p>
            <p class="text-gray-400 text-sm mt-4">${n.published_at ? new Date(n.published_at).toLocaleDateString() : ''}</p>
          </div>
        </div>
      </div>
    `;
  });
}