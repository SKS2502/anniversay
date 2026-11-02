export function createMemoryPopup() {
  const dialog = document.querySelector('#memory-popup');
  const closeButton = document.querySelector('#memory-close');
  const title = document.querySelector('#memory-title');
  const date = document.querySelector('#memory-date');
  const message = document.querySelector('#memory-message');
  const image = document.querySelector('#memory-image');
  const imagePlaceholder = document.querySelector('#memory-image-placeholder');
  const imagePlaceholderText = imagePlaceholder.querySelector('p');
  let onClose = () => {};

  function close() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    image.removeAttribute('src');
    onClose();
  }

  function open(memory, closeCallback) {
    onClose = closeCallback;
    title.textContent = memory.title;
    date.textContent = memory.date || '';
    date.hidden = !memory.date;
    message.textContent = memory.message;
    if (memory.image) {
      image.src = memory.image;
      image.alt = memory.title;
      image.hidden = false;
      imagePlaceholder.hidden = true;
    } else {
      image.removeAttribute('src');
      image.hidden = true;
      imagePlaceholder.hidden = false;
      imagePlaceholderText.textContent = 'Your photo goes here';
    }
    dialog.hidden = false;
    closeButton.focus();
  }

  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  image.addEventListener('error', () => {
    image.hidden = true;
    imagePlaceholder.hidden = false;
    imagePlaceholderText.textContent =
      'Photo unavailable. Check its path in src/config/memories.js.';
  });
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && !dialog.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    }
  });

  return { open, close, isOpen: () => !dialog.hidden };
}
