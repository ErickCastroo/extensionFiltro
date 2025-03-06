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

function mostrarIndicadoresScroll() {
  const scrollbar = document.createElement('div');
  scrollbar.id = 'scrollbar-indicadores';
  scrollbar.style.position = 'fixed';
  scrollbar.style.right = '0';
  scrollbar.style.top = '0';
  scrollbar.style.width = '10px';
  scrollbar.style.height = '100%';
  scrollbar.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  document.body.appendChild(scrollbar);

  foliosResaltados.forEach((elemento) => {
    const indicador = document.createElement('div');
    indicador.style.position = 'absolute';
    indicador.style.right = '0';
    indicador.style.width = '10px';
    indicador.style.height = '5px';
    indicador.style.backgroundColor = 'yellow';
    indicador.style.top = `${(elemento.offsetTop / document.body.scrollHeight) * 100}%`;
    scrollbar.appendChild(indicador);
  });
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