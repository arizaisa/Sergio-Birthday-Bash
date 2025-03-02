window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.style.opacity = "0"; // Hace que desaparezca suavemente
    setTimeout(() => {
      preloader.style.display = "none"; // Lo oculta completamente
    }, 500); // 🔄 Mantiene la transición suave
  }, 6000); // 🔄 Ahora el preloader se mantiene visible por 10 segundos
});

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".grid_container");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.querySelector(".close");

  // 📌 Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // 🚀 Cargar JSON con las cartas
  fetch("cartas.json")
    .then((response) => response.json())
    .then((data) => {
      data.cartas.forEach((carta) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = carta.numero;

        // 📌 Comparar fecha de apertura con la fecha actual
        if (carta.fechaApertura > today) {
          card.classList.add("locked"); // 🔒 Si la fecha aún no ha llegado, se bloquea
          card.style.opacity = "0.7";
          card.style.pointerEvents = "none"; // Evita clics en cartas bloqueadas
        } else {
          card.addEventListener("click", () => abrirModal(carta));
        }

        gridContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Error al cargar cartas:", error));

  function abrirModal(carta) {
    modalBody.innerHTML = ""; // Limpiar contenido previo

    // 📌 Agregar texto antes de la imagen o el contador
    if (carta.texto) {
      const texto = document.createElement("p");
      texto.textContent = carta.texto;
      texto.classList.add("texto-modal"); // Agregar una clase para aplicar estilos
      modalBody.appendChild(texto);
    }

    // 📌 Si la carta es la primera ("1"), agregar Countdown en lugar de imágenes
    if (carta.numero === "1") {
      const countdown = document.createElement("div");
      countdown.id = "countdown";
      countdown.style.fontSize = "24px";
      countdown.style.textAlign = "center";
      countdown.style.marginTop = "20px";
      modalBody.appendChild(countdown);

      function updateCountdown() {
        const now = new Date().getTime();
        const eventDate = new Date("March 20, 2025 00:00:00").getTime();
        const timeLeft = eventDate - now;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          countdown.innerHTML = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          countdown.innerHTML = "🎉 ¡El evento ha comenzado!";
        }
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    } else {
      // 📌 Si no es la primera carta, mostrar imágenes normales
      if (carta.imagenes) {
        const imagenContainer = document.createElement("div");

        // 📌 Si la carta es la 3, aplicar un layout de imágenes en fila
        if (carta.numero === "3") {
          imagenContainer.classList.add("imagenes-grid");
        }

        carta.imagenes.forEach((src) => {
          const img = document.createElement("img");
          img.src = src;
          img.style.width = "100%";
          img.style.maxWidth = "200px"; // Ajusta el tamaño de las imágenes
          img.style.margin = "5px"; // Espaciado entre imágenes
          imagenContainer.appendChild(img);
        });

        modalBody.appendChild(imagenContainer);
      }
    }

    modal.style.display = "flex";
  }

  // 📌 Cerrar modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
