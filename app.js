document.getElementById("boton").addEventListener("click", function () {
  document.getElementById("mensaje").textContent =
    "Funciona. Hoy es " + new Date().toLocaleDateString("es-AR");
});
