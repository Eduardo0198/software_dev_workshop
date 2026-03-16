function mostrarInfo(nombre, descripcion) {
  document.getElementById("modalTitle").textContent = nombre;
  document.getElementById("modalBody").textContent = descripcion;

  const modal = new bootstrap.Modal(document.getElementById("infoModal"));
  modal.show();
}