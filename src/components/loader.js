import { create, $, clear } from '../utils/dom.js';

let loaderElement = null;

export function showLoader(message = 'Cargando...') {
  hideLoader();

  const loader = $('#loader') || create('div', 'loader');
  loader.id = 'loader';
  loader.className = 'loader';
  loader.style.display = 'flex';

  clear(loader);

  const spinner = create('div', 'loader-spinner');
  const text = create('div', 'loader-text', message);

  loader.appendChild(spinner);
  loader.appendChild(text);

  if (!$('#loader')) {
    document.body.appendChild(loader);
  }

  loaderElement = loader;
}

export function hideLoader() {
  if (loaderElement) {
    loaderElement.style.display = 'none';
  }
}
