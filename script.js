// script.js

document.getElementById('telefone').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
  let formatted = '';

  if (value.length > 10) {
    formatted = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (value.length > 6) {
    formatted = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (value.length > 2) {
    formatted = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    formatted = value.replace(/^(\d*)/, '($1');
  }

  e.target.value = formatted;
});

function enviarFormulario(event) {
  event.preventDefault();

  const form = document.querySelector(".formulario");
  const inputs = form.querySelectorAll("input");

  const nome = inputs[0].value.trim();
  const telefone = inputs[1].value.trim();
  const email = inputs[2].value.trim();

  if (!nome || !telefone) {
    alert("Por favor, preencha nome e telefone.");
    return;
  }

  // IDs dos campos no Google Forms
  const formAction = "https://docs.google.com/forms/d/e/1FAIpQLSekoVFFkPLD0Y4V0NO3mkcJGXdmLgKlMh2Kux4VNT8_mR4f-g/formResponse";
  const data = new FormData();

  data.append("entry.2005620554", nome);     // Nome
  data.append("entry.1166974658", telefone); // Telefone
  data.append("entry.1045781291", email);    // Email

  fetch(formAction, {
    method: "POST",
    mode: "no-cors",
    body: data,
  })
    .then(() => {
      mostrarModal("Formulário enviado com sucesso! O eBook será enviado em poucos instantes para seu e-mail. Verifique a caixa de entrada.");
      form.reset();
    })
    .catch((err) => {
      console.error("Erro ao enviar:", err);
      mostrarModal("Erro ao enviar o formulário. Tente novamente.");
    });
}


// Animações on-scroll (fade-in)
document.addEventListener("DOMContentLoaded", function () {
  const texts = document.querySelectorAll(".text");
  const imgs = document.querySelectorAll(".image");
  const forms = document.querySelectorAll(".formulario");

  const observador = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        entry.target.classList.remove("div-hidden");
      } else {
        entry.target.classList.remove("fade-in");
        entry.target.classList.add("div-hidden");
      }
    });
  }, {
    threshold: 0.2
  });

  texts.forEach(el => {
    observador.observe(el);
  });
  imgs.forEach(el => {
    observador.observe(el);
  });
  forms.forEach(el => {
    observador.observe(el);
  });
});

document.getElementById('scrollBtn').addEventListener('click', function () {
  const destino = document.getElementById('formulario');
  destino.scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('aprenderBtn').addEventListener('click', function () {
  const destino = document.getElementById('queroAprender');
  destino.scrollIntoView({ behavior: 'smooth' });
});

// Mostra modal de mensagem personalizada
function mostrarModal(mensagem) {
  const modal = document.getElementById("modalMensagem");
  const texto = document.getElementById("modalTexto");
  texto.textContent = mensagem;
  modal.style.display = "flex";
}

// Fecha o modal
function fecharModal() {
  document.getElementById("modalMensagem").style.display = "none";
}

//Formulário enviado com sucesso! O eBook será enviado em poucos instantes para seu e-mail. Verifique a caixa de entrada.