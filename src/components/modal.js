import { create, $, on } from '../utils/dom.js';

export class Modal {
  constructor() {
    this.element = null;
    this.content = null;
    this.onClose = null;
  }

  open(title, bodyHTML, options = {}) {
    this.close();

    const modal = create('div', 'modal');
    const modalContent = create('div', 'modal-content');

    const header = create('div', 'modal-header');
    const h3 = create('h3', '', title);
    const closeBtn = create('button', 'modal-close', '✕');
    closeBtn.type = 'button';
    
    header.appendChild(h3);
    header.appendChild(closeBtn);

    const body = create('div', 'modal-body');
    body.innerHTML = bodyHTML;

    modalContent.appendChild(header);
    modalContent.appendChild(body);

    if (options.footer) {
      const footer = create('div', 'modal-footer');
      footer.innerHTML = options.footer;
      modalContent.appendChild(footer);
    }

    modal.appendChild(modalContent);
    
    const root = $('#modal-root');
    if (root) {
      root.appendChild(modal);
    } else {
      document.body.appendChild(modal);
    }

    this.element = modal;
    this.content = body;

    on(closeBtn, 'click', () => this.close());
    on(modal, 'click', (e) => {
      if (e.target === modal) {
        this.close();
      }
    });

    return body;
  }

  close() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      this.content = null;
      
      if (this.onClose) {
        this.onClose();
        this.onClose = null;
      }
    }
  }

  setOnClose(callback) {
    this.onClose = callback;
  }
}
