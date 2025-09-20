async function loadEvents() {
  const { data, error } = await supabase
    .from('Events')
    .select(`
      id,
      title,
      subtitle,
      description,
      start_date,
      end_date,
      location
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
          <div class="p-2"><!-- Contenido -->

            <!-- Título -->
            <h3 class="text-2xl font-bold text-blue-800 mb-2">${e.title}</h3>

            <!-- Subtítulo -->
            <p class="text-gray-600 mb-4" style="font-size: large; font-weight: bold;">${e.subtitle}</p>

            <!-- Descripción -->
            <p class="text-gray-700 mb-6 text-justify">${e.description}</p>

            <!-- Ubicación + Fecha -->
            <div class="grid grid-cols-2" style="padding-left: 20px; padding-right: 20px; justify-items: center; align-items: center;">
              <div class="flex items-center mb-4"><!-- Ubicación -->
                <i data-feather="map-pin" class="w-4 h-4 mr-2"></i>
                <span class="text-xl text-gray-500">${e.location}</span>
              </div>

              <div class="bg-blue-800 text-white p-3 rounded-xl text-center inline-block mb-4"><!-- Fecha -->
                <div class="text-xl font-bold">${new Date(e.start_date).toLocaleDateString()}</div>
                <div class="text-xs">Até</div>
                <div class="text-xl font-bold">${new Date(e.end_date).toLocaleDateString()}</div>
              </div>
            </div>

            <!-- Tags -->
            <div class="grid grid-cols-2 gap-2" style="padding-left: 60px; padding-right: 60px;">
              <span style="justify-self: center;" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">País</span>
              <span style="justify-self: center;" class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Categoría</span>
            </div>

          </div>
        </div>
    `
  })
}
