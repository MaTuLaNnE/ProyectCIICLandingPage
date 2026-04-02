(function () {
  (function(){
  emailjs.init("L-dkwk2oxyNQ6gRy7");
})();

  document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".contact-form");

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
          country: form.querySelector('[name="country"]')?.value || "",
          email: form.querySelector('[name="email"]')?.value || "",
          message: form.querySelector('[name="message"]')?.value || ""
        };

        emailjs.send("service_4mt67zj", "template_c4jllh7", templateParams)
          .then(function () {
            if (statusBox) {
              statusBox.textContent = "Mensagem enviada com sucesso.";
              statusBox.className = "text-sm rounded-lg px-4 py-3 bg-green-100 text-green-700";
            } else {
              alert("Mensagem enviada com sucesso.");
            }

            form.reset();

            setTimeout(() => {
              if (typeof closeContactModal === "function") {
                closeContactModal();
              }
            }, 1200);
          })
          .catch(function (error) {
            console.error("Erro ao enviar o formulário:", error);

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
  });
})();