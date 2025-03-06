/**
 * Agrega un evento al botón de 'resaltar' que lee el archivo Excel seleccionado,
 * extrae los folios y envía los datos al contenido de la página para resaltar los folios.
 */
document.getElementById("resaltarBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput")
  const file = fileInput.files[0]
  const resaltarBtn = document.getElementById("resaltarBtn")

  if (file) {
    resaltarBtn.disabled = true // Bloquear el botón después de hacer clic

    const reader = new FileReader()

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: "array" })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const folios = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).flat()

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "resaltar", folios: folios },
          (response) => {
            if (response && response.success) {
              document.getElementById("navegacion").style.display = "block"

              alert("Folios resaltados correctamente.")
              // Puedes quitar el alert y mantener solo el Toast
            } else {
              alert("No se encontraron folios en la página.")
              resaltarBtn.disabled = false
            }
          }
        )
      })
    }

    reader.readAsArrayBuffer(file)
  } else {
    alert("Por favor, selecciona un archivo Excel.")
  }
})

// Agregar eventos para botones de navegación
document.getElementById("anteriorBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "navegar",
      direccion: "anterior",
    })
  })
})

document.getElementById("siguienteBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "navegar",
      direccion: "siguiente",
    })
  })
})
