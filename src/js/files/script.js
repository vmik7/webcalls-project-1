
// Burger interactive

const menuBurger = document.querySelector('.menu__burger');
const menuBody = document.querySelector('.menu__body');

menuBurger.addEventListener('click', function(){
    menuBurger.classList.toggle('_active');
    menuBody.classList.toggle('_active');
    document.body.classList.toggle('_lock');
});