document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.fi-rr-menu-burger');
    const mobileMenu = document.querySelector('#menu-wrapper');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const search = document.querySelector('.search')
    const btn = document.querySelector('.btn')
    const input = document.querySelector('.input')

    btn.addEventListener('click', () => {
        search.classList.toggle('active')
        input.focus()
    })

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
        main.classList.toggle('blur-item');
        footer.classList.toggle('blur-item');
    });
});
