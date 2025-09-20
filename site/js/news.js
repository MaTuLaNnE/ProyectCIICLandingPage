async function loadNews() {
  const { data, error } = await supabase
    .from('News')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error cargando noticias:', error)
    return
  }

  const container = document.getElementById('news-list')
  container.innerHTML = ''

  data.forEach(n => {
    container.innerHTML += `
        <div class="max-w-md mx-auto">
        <div class="grid grid-cols-1 event-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <!-- Imagen -->
          <img src="${n.image_url ?? 'https://via.placeholder.com/150'}" alt="Evento CIIC" class="w-full h-48 object-cover">

          <!-- Contenido -->
          <div class="p-4 flex flex-col">
            <!-- Título pegado a la imagen (sin margin-bottom) -->
            <h3 class="text-xl font-bold text-blue-800">${n.title}</h3>
            
            <!-- Subtítulo más separado con margin-top más grande -->
            <p class="text-gray-600 mt-6">${n.summary ?? ''}</p>
            
            <!-- Fecha abajo del todo, chica -->
            <p class="text-gray-400 text-sm mt-4">${new Date(n.published_at).toLocaleDateString()}</p>
          </div>
        </div>
    </div>
    `
  })
}
