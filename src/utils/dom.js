export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function create(tag, className = '', text = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

export function clear(element) {
  if (element) {
    element.innerHTML = '';
  }
}

export function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

export function show(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}

export function hide(element) {
  if (element) {
    element.classList.add('hidden');
  }
}

export function toggle(element, force) {
  if (element) {
    element.classList.toggle('hidden', !force);
  }
}

export function on(element, event, handler, options) {
  if (element) {
    element.addEventListener(event, handler, options);
  }
}

export function off(element, event, handler) {
  if (element) {
    element.removeEventListener(event, handler);
  }
}

export function delegate(parent, selector, event, handler) {
  on(parent, event, (e) => {
    const target = e.target.closest(selector);
    if (target) {
      handler.call(target, e);
    }
  });
}
