async function loadEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(`
      eventid,
      title,
      summary,
      start_date,
      created_ay,
      countryId,
      categoryId,
      subtitle,
      end_date,
      location,
      isVirtual
    `)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error cargando eventos:', error)
    return
  }

  const container = document.getElementById('events-list')
  container.innerHTML = ''

  data.forEach(e => {
    container.innerHTML += `
      <div class="grid grid-cols-1 event-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
        <div class="p-6">
          <!-- Header Section -->
          <div class="mb-6">
            <!-- Título -->
            <h3 class="text-2xl font-bold text-blue-800 mb-4 leading-tight">${e.title}</h3>
            
            <!-- Subtítulo -->
            <p class="text-lg font-semibold text-gray-600 leading-relaxed">${e.subtitle}</p>
          </div>

          <!-- Descripción -->
          <div class="mb-8">
            <p class="text-gray-700 text-justify leading-relaxed">${e.description}</p>
          </div>

          <!-- Info Section -->
          <div class="space-y-6">
            <!-- Ubicación + Fecha -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center">
                <i data-feather="map-pin" class="w-5 h-5 mr-3 text-gray-400"></i>
                <span class="text-lg text-gray-600">${e.location}</span>
              </div>

              <div class="bg-blue-800 text-white px-4 py-3 rounded-xl text-center min-w-[140px]">
                <div class="text-lg font-bold">${new Date(e.start_date).toLocaleDateString()}</div>
                <div class="text-xs opacity-75">Até</div>
                <div class="text-lg font-bold">${new Date(e.end_date).toLocaleDateString()}</div>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-3 justify-center pt-2">
              <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">País</span>
              <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Categoría</span>
            </div>
          </div>
        </div>
      </div>
    `
  })
}
