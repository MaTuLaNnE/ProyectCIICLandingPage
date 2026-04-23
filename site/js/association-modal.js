async function loadAssociationModal() {
  try {
    const response = await fetch("components/association-modal.html");
    const html = await response.text();

    let container = document.getElementById("association-modal-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "association-modal-container";
      document.body.appendChild(container);
    }

    container.innerHTML = html;

    setupAssociationForm();

    if (window.feather) {
      feather.replace();
    }
  } catch (error) {
    console.error("Error cargando modal de asociación:", error);
  }
}

function openAssociationModal() {
  const modal = document.getElementById("associationModal");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function closeAssociationModal() {
  const modal = document.getElementById("associationModal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

function setupAssociationForm() {
  const form = document.getElementById("associationForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    console.log("Solicitud de asociación:", data);

    // Acá después podés conectar EmailJS si querés
    alert("Solicitação enviada com sucesso.");
    form.reset();
    closeAssociationModal();
  });
}

document.addEventListener("DOMContentLoaded", loadAssociationModal);