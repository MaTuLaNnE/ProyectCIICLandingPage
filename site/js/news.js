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
      <article class="news-card">
        <h2>${n.title}</h2>
        <p>${n.summary ?? ''}</p>
        <small>${new Date(n.published_at).toLocaleDateString()}</small>
        <img src="${n.image_url ?? 'https://via.placeholder.com/150'}" alt="${n.title}" />
      </article>
    `
  })
}
