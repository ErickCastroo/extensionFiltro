/**
 * Agrega un evento al botón de 'resaltar' que lee el archivo Excel seleccionado,
 * extrae los folios de la columna 1 y envía los datos al contenido de la página para resaltar los folios.
 */
document.getElementById("resaltarBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const resaltarBtn = document.getElementById("resaltarBtn");

  if (file) {
    resaltarBtn.disabled = true; // Bloquear el botón después de hacer clic

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convertir la hoja a JSON (array de arrays)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extraer solo la columna 1 (primera columna)
      const columna1 = jsonData.map((row) => row[0]).filter((folio) => folio); // Filtramos valores vacíos

      // Enviar los folios al content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "resaltar", folios: columna1 },
          (response) => {
            if (response && response.success) {
              document.getElementById("navegacion").style.display = "block";
              alert("Folios resaltados correctamente.");
            } else {
              alert("No se encontraron folios en la página.");
              resaltarBtn.disabled = false;
            }
          }
        );
      });
    };

    reader.readAsArrayBuffer(file);
  } else {
    alert("Por favor, selecciona un archivo Excel.");
  }
});

// Agregar eventos para botones de navegación
document.getElementById("anteriorBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "navegar",
      direccion: "anterior",
    });
  });
});

document.getElementById("siguienteBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "navegar",
      direccion: "siguiente",
    });
  });
});