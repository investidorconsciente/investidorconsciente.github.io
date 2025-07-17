function enviarFormulario(event) {
  event.preventDefault();
  alert("✅ Obrigado! Seu eBook será enviado para seu e-mail em instantes.");
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