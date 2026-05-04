async function loadHomeEvents() {
  const container = document.getElementById("home-events-list");
  if (!container) return;

  if (!window.supabaseClient) {
    container.innerHTML = `<div class="col-span-full text-center text-red-600">Error: Supabase no inicializado</div>`;
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await window.supabaseClient
    .from("events")
    .select("*")
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(3);

  if (error) {
    container.innerHTML = `<div class="col-span-full text-center text-red-600">Error: ${error.message}</div>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center text-gray-500">No hay próximos eventos cargados.</div>`;
    return;
  }

  container.innerHTML = "";

  data.forEach((event) => {
    const eventDate = new Date(event.start_date);
    const day   = eventDate.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" });
    const month = eventDate.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
                           .replace(".", "").toUpperCase();

    const title    = event.title ?? "";
    const summary  = event.summary ?? event.subtitle ?? "";
    const location = event.location ?? "Virtual";
    const category = event.category ?? event.categoria ?? "Evento";

    container.innerHTML += `
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">

        <div class="bg-blue-800 text-white px-5 py-4 flex items-center justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold leading-none">${day}</span>
            <span class="text-xs tracking-widest opacity-80 uppercase">${month}</span>
          </div>
          <span class="text-xs font-medium px-3 py-1 rounded-full border border-white/30 bg-white/15 tracking-wide">
            ${category}
          </span>
        </div>

        <div class="p-5 flex flex-col gap-1.5 flex-1">
          <h3 class="font-bold text-gray-900 leading-snug">${title}</h3>
          <p class="text-gray-600 text-sm leading-relaxed flex-1">${summary}</p>
        </div>

        <div class="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
          <i data-feather="map-pin" class="w-3.5 h-3.5 text-green-600 flex-shrink-0"></i>
          <span class="text-xs text-gray-500">${location}</span>
        </div>

      </div>
    `;
  });

  if (window.feather) feather.replace();
  if (window.AOS) AOS.refresh();
}

window.addEventListener("DOMContentLoaded", loadHomeEvents);