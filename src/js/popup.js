'use strict'

let popups = document.querySelectorAll('.popup');
for (let popup of popups) {
    let popupCross = popup.querySelector('.popup__cross');

    let closePopup = () => {
        popup.style.display = 'none';
    };

    popupCross.addEventListener('click', closePopup);
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    }); 
}