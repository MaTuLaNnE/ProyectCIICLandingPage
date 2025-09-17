async function loadEvents() {
  const { data, error } = await supabase
    .from('Events')
    .select('*')
    .order('start_date', { ascending: false })


  if (error) {
    console.error('Error cargando eventos:', error)
    return
  }

  const container = document.getElementById('events-list')
  container.innerHTML = ''

  data.forEach(e => {
    container.innerHTML += `
      <article class="events-card">
        <h2>${e.title}</h2>
        <p>${e.subtitle ?? ''}</p>
        <small>${new Date(e.start_date).toLocaleDateString()}</small>
      </article>
    `
  })
}
