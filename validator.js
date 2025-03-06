document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0]; // Obtiene el archivo seleccionado
  const errorMessage = document.getElementById("error-message");

  if (file) {
    const validExtensions = ["xlsx", "xls", "csv"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      errorMessage.textContent =
        "Seleccione un archivo válido (.xlsx, .xls, .csv)";
      this.value = ""; // Resetea el input para evitar el envío de archivos inválidos
    } else {
      errorMessage.textContent = ""; // Borra el mensaje si el archivo es válido
    }
  }
});
