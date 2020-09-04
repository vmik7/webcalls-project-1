
// Burger interactive

const menuButton = document.querySelector('.menu__button');
const menuBody = document.querySelector('.menu__body');
const pageBody = document.querySelector('.page__body');

menuButton.addEventListener('click', () => {
    let expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !expanded);
    menuButton.classList.toggle('menu__button_active');
    menuBody.classList.toggle('menu__body_open');
    pageBody.classList.toggle('page__body_lock');
});