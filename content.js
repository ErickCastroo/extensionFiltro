let foliosResaltados = [];
let indiceActual = -1;

function resaltarFolios(folios) {
  foliosResaltados = [];
  folios.forEach((folio, index) => {
    const regex = new RegExp(`(${folio})`, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(
      regex,
      `<span class="resaltado" data-folio="${folio}">$1</span>`
    );
  });

  foliosResaltados = Array.from(document.querySelectorAll('.resaltado'));
  mostrarIndicadoresScroll();
  return { success: true };
}

function navegar(direccion) {
  if (foliosResaltados.length === 0) return;

  if (direccion === 'siguiente') {
    indiceActual = (indiceActual + 1) % foliosResaltados.length;
  } else if (direccion === 'anterior') {
    indiceActual = (indiceActual - 1 + foliosResaltados.length) % foliosResaltados.length;
  }

  const elemento = foliosResaltados[indiceActual];
  elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  elemento.style.backgroundColor = 'orange'; // Resaltar el elemento actual
  setTimeout(() => {
    elemento.style.backgroundColor = 'yellow'; // Volver al color original
  }, 1000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'resaltar') {
    sendResponse(resaltarFolios(request.folios));
  } else if (request.action === 'navegar') {
    navegar(request.direccion);
  }
});