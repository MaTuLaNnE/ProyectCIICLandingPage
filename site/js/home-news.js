async function loadHomeNews() {
  console.log("loadHomeNews arrancó");

  const container = document.getElementById("home-news-list");

  if (!container) {
    console.error("No existe #home-news-list");
    return;
  }

  if (!window.supabaseClient) {
    console.error("No existe window.supabaseClient");
    container.innerHTML = `
      <p class="col-span-full text-center text-red-200 py-8">
        Error: Supabase no inicializado.
      </p>
    `;
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(4);

  console.log("Respuesta home news:", { data, error });

  if (error) {
    console.error("Error cargando noticias:", error);
    container.innerHTML = `
      <p class="col-span-full text-center text-red-200 py-8">
        Error cargando notícias.
      </p>
    `;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
      <p class="col-span-full text-center text-blue-100 py-8">
        No hay noticias disponibles.
      </p>
    `;
    return;
  }

  container.innerHTML = "";

  data.forEach((n, index) => {
    const date = n.published_at
      ? new Date(n.published_at).toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

    const title = n.title ?? "";
    const summary = n.summary ?? "";
    const imageUrl = n.image_url ?? "";

    container.innerHTML += `
      <article 
        class="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
        data-aos="fade-up"
        data-aos-delay="${100 + index * 50}"
      >
        ${
          imageUrl
            ? `
              <div class="h-48 bg-blue-900 overflow-hidden">
                <img 
                  src="${imageUrl}" 
                  alt="${title}"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onerror="this.parentElement.style.display='none';"
                >
              </div>
            `
            : ""
        }

        <div class="p-6">
          <div class="flex items-start mb-4">
            <div class="bg-blue-100 text-blue-800 p-2 rounded-full mr-4 shrink-0">
              <i data-feather="trending-up" class="w-5 h-5"></i>
            </div>

            <div>
              <h3 class="text-xl font-bold text-blue-900 leading-snug line-clamp-2">
                ${title}
              </h3>

              ${
                date
                  ? `<p class="text-blue-600 text-sm mt-1">${date}</p>`
                  : ""
              }
            </div>
          </div>

          <p class="mb-5 text-gray-600 leading-relaxed line-clamp-3">
            ${summary}
          </p>

          <div class="flex justify-between items-center border-t border-gray-100 pt-4">
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Notícia
            </span>

            <a href="news.html" class="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              Ler mais
              <i data-feather="arrow-right" class="w-4 h-4 ml-1"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  });

  if (window.feather) {
    feather.replace();
  }

  if (window.AOS) {
    AOS.refresh();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadHomeNews();
});