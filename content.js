// Array para almacenar los elementos resaltados
let foliosResaltados = []
// Variable para llevar un control del índice actual
let indiceActual = -1

// Función para resaltar los folios en el documento
function resaltarFolios(folios) {
  try {
    // Iterar sobre los folios proporcionados
    folios.forEach((folio) => {
      // Crear una expresión regular para encontrar todas las ocurrencias del folio
      const regex = new RegExp(`(${folio})`, "gi")

      // Reemplazar el texto en el documento con una etiqueta <span> que resalta el folio
      document.body.innerHTML = document.body.innerHTML.replace(
        regex,
        `<span class='resaltado' data-folio='${folio}'>$1</span>`
      )
    })

    // Almacenar todos los elementos resaltados en el array
    foliosResaltados = Array.from(document.querySelectorAll(".resaltado"))

    // Retornar un objeto con un estado de éxito
    return { success: true }
  } catch (error) {
    console.error("Error en resaltarFolios:", error)
    return { success: false, error: error.message }
  }
}

// Función para navegar entre los folios resaltados (siguiente o anterior)
function navegar(direccion) {
  try {
    // Si no hay folios resaltados, salir de la función
    if (foliosResaltados.length === 0) return

    // Lógica para determinar el índice según la dirección (siguiente o anterior)
    if (direccion === "siguiente") {
      indiceActual = (indiceActual + 1) % foliosResaltados.length // Avanzar al siguiente folio
    } else if (direccion === "anterior") {
      indiceActual =
        (indiceActual - 1 + foliosResaltados.length) % foliosResaltados.length // Retroceder al folio anterior
    }

    // Obtener el elemento correspondiente al índice actual
    const elemento = foliosResaltados[indiceActual]

    // Desplazar la vista hacia el elemento resaltado
    elemento.scrollIntoView({ behavior: "smooth", block: "center" })

    // Cambiar el color de fondo del elemento resaltado a naranja
    elemento.style.backgroundColor = "orange"

    // Volver al color de fondo original (amarillo) después de 1 segundo
    setTimeout(() => {
      elemento.style.backgroundColor = "yellow"
    }, 100)
  } catch (error) {
    console.error("Error en navegar:", error)
  }
}

// Escuchar mensajes del background script de la extensión (Chrome runtime)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    // Si la acción es 'resaltar', llamar a la función resaltarFolios
    if (request.action === "resaltar") {
      const resultado = resaltarFolios(request.folios)
      sendResponse(resultado)

      const navegacion = document.getElementById('navegacion')
      const totalFolios = document.getElementById('totalFolios')

      if (navegacion && totalFolios) {
        navegacion.style.display = 'block'
        totalFolios.innerText = request.folios.length
      }
    }
    // Si la acción es 'navegar', llamar a la función navegar
    else if (request.action === "navegar") {
      navegar(request.direccion)
    }
  } catch (error) {
    console.error("Error en el listener de mensajes:", error)
    sendResponse({ success: false, error: error.message })
  }
})