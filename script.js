// script.js

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
      alert("Formulário enviado com sucesso! Verifique seu e-mail.");
      form.reset();
    })
    .catch((err) => {
      console.error("Erro ao enviar:", err);
      alert("Erro ao enviar o formulário. Tente novamente.");
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
      } else {
        entry.target.classList.remove("fade-in");
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

// so tentando algo