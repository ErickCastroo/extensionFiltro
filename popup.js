/**
 * Agrega un evento al botón de 'resaltar' que lee el archivo Excel seleccionado,
 * extrae los folios y envía los datos al contenido de la página para resaltar los folios.
 */
document.getElementById('resaltarBtn').addEventListener('click', () => {
  // Obtener el archivo seleccionado desde el input de archivo.
  const fileInput = document.getElementById('fileInput')
  const file = fileInput.files[0]

  // Verificar si se ha seleccionado un archivo.
  if (file) {
    // Crear un lector de archivos para leer el contenido del archivo Excel.
    const reader = new FileReader()
    
    // Definir lo que sucede cuando el archivo se carga exitosamente.
    reader.onload = function (e) {
      // Leer el archivo como un array de bytes.
      const data = new Uint8Array(e.target.result)
      
      // Utilizar la librería XLSX para leer el archivo Excel.
      const workbook = XLSX.read(data, { type: 'array' })
      
      // Obtener el nombre de la primera hoja del libro.
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convertir la hoja Excel a un arreglo de folios (unidimensional).
      const folios = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).flat()

      // Enviar los folios a la pestaña activa para resaltarlos.
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'resaltar', folios: folios }, (response) => {
          // Si la respuesta es exitosa, mostrar los controles de navegación.
          if (response && response.success) {
            document.getElementById('navegacion').style.display = 'block'
          }
        })
      })
    }

    // Leer el archivo como un ArrayBuffer.
    reader.readAsArrayBuffer(file)
  } else {
    // Si no se ha seleccionado un archivo, mostrar una alerta.
    alert('Por favor, selecciona un archivo Excel.')
  }
})

/**
 * Agrega un evento al botón 'anterior' para navegar al folio anterior en la página.
 */
document.getElementById('anteriorBtn').addEventListener('click', () => {
  // Enviar un mensaje a la pestaña activa para navegar al folio anterior.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'navegar', direccion: 'anterior' })
  })
})

/**
 * Agrega un evento al botón 'siguiente' para navegar al siguiente folio en la página.
 */
document.getElementById('siguienteBtn').addEventListener('click', () => {
  // Enviar un mensaje a la pestaña activa para navegar al siguiente folio.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'navegar', direccion: 'siguiente' })
  })
})
