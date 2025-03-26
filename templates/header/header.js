function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#header-navigation", () => {
    const search = document.querySelector('.search');
    const btn = document.querySelector('.btn');
    const input = document.querySelector('.input');

    btn.addEventListener('click', () => {
        if (search.classList.contains('active')) {
            search.classList.remove('active');
            input.blur();
        } else {
            search.classList.add('active');
            setTimeout(() => {
                input.focus();
            }, 50);
        }
    });

    document.addEventListener('click', (event) => {
        const isClickInsideSearch = search.contains(event.target);
        if (!isClickInsideSearch && search.classList.contains('active')) {
            search.classList.remove('active');
        }
    });
});