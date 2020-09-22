
// Blocking Elements functons

function makeBlocking(element) {
    document.$blockingElements.push(element);
}
function undoBlocking(element) {
    document.$blockingElements.remove(element);
}


// Burger interactive

if (window.matchMedia('(max-width: 768px)').matches) {
    const pageBody = document.querySelector('.page__body');
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu__button');
    const menuBody = document.querySelector('.menu__body');

    let showNavMenu = () => {
        menuButton.setAttribute('aria-expanded', true)
        menuButton.classList.add('menu__button_active');
        menuBody.classList.add('menu__body_open');

        pageBody.classList.add('page__body_lock');
        menuBody.inert = false;
        makeBlocking(menu);
    };

    let hideNavMenu = () => {
        menuButton.setAttribute('aria-expanded', false)
        menuButton.classList.remove('menu__button_active');
        menuBody.classList.remove('menu__body_open');

        pageBody.classList.remove('page__body_lock');
        menuBody.inert = true;
        undoBlocking(menu);
    };
    
    menuButton.addEventListener('click', () => {
        let expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;

        if (!expanded) {
            showNavMenu();
        }
        else {
            hideNavMenu();
        }
    });

    hideNavMenu();
}

