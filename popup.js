document.getElementById('resaltarBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const folios = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).flat();

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'resaltar', folios: folios }, (response) => {
          if (response && response.success) {
            document.getElementById('navegacion').style.display = 'block';
          }
        });
      });
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Por favor, selecciona un archivo Excel.');
  }
});

document.getElementById('anteriorBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'navegar', direccion: 'anterior' });
  });
});

document.getElementById('siguienteBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'navegar', direccion: 'siguiente' });
  });
});