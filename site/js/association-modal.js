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
  (function () {
    emailjs.init("L-dkwk2oxyNQ6gRy7");
  })();

  const forms = document.querySelectorAll(".association-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const statusBox = form.querySelector("[data-form-status]");
      const originalButtonText = submitButton ? submitButton.innerHTML : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = "Enviando...";
      }

      if (statusBox) {
        statusBox.classList.add("hidden");
        statusBox.textContent = "";
        statusBox.className = "hidden text-sm rounded-lg px-4 py-3";
      }

      const templateParams = {
        name: form.querySelector('[name="name"]')?.value || "",
        email: form.querySelector('[name="email"]')?.value || "",
        phone: form.querySelector('[name="phone"]')?.value || "",
        subject: form.subject.value,
        message: form.querySelector('[name="message"]')?.value || ""
      };

      emailjs.send("service_4mt67zj", "template_egr19lw", templateParams)
        .then(function () {
          if (statusBox) {
            statusBox.textContent = "Solicitação enviada com sucesso.";
            statusBox.className = "text-sm rounded-lg px-4 py-3 bg-green-100 text-green-700";
          } else {
            alert("Solicitação enviada com sucesso.");
          }

          form.reset();

          setTimeout(() => {
            if (typeof closeAssociationModal === "function") {
              closeAssociationModal();
            }
          }, 1200);
        })
        .catch(function (error) {
          console.error("Erro ao enviar solicitação de associação:", error);

          if (statusBox) {
            statusBox.textContent = "Ocorreu um erro ao enviar. Tente novamente.";
            statusBox.className = "text-sm rounded-lg px-4 py-3 bg-red-100 text-red-700";
          } else {
            alert("Ocorreu um erro ao enviar.");
          }
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
          }
        });
    });
  });
}

document.addEventListener("DOMContentLoaded", loadAssociationModal);