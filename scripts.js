const Modal = {
  open() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.add('active');
  },

  close() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.remove('active');
  }
}
