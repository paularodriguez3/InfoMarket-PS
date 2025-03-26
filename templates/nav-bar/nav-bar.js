function initNavBar() {
    const body = document.body;
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    const desktopMenuIcon = document.querySelector('#nav-list .fi-rr-menu-burger');
    const megaMenu = document.getElementById('menu-wrapper');

    if (desktopMenuIcon && megaMenu) {
        desktopMenuIcon.addEventListener('click', function(e) {
            e.preventDefault();
            megaMenu.classList.toggle('show-menu');

            main.classList.toggle('blur-item', megaMenu.classList.contains('show-menu'));
            footer.classList.toggle('blur-item', megaMenu.classList.contains('show-menu'));
            body.style.overflow = megaMenu.classList.contains('show-menu') ? 'hidden' : 'auto';
        });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            mobileMenu.classList.toggle('hidden');

            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            main.classList.toggle('blur-item', isMenuOpen);
            footer.classList.toggle('blur-item', isMenuOpen);
            body.style.overflow = isMenuOpen ? 'hidden' : 'auto';

            if (megaMenu && megaMenu.classList.contains('show-menu')) {
                megaMenu.classList.remove('show-menu');
                main.classList.remove('blur-item');
                footer.classList.remove('blur-item');
            }
        });
    }

    document.addEventListener('click', function(e) {
        // Para móvil
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            const isClickInsideMobile = e.target.closest('#mobile-menu') || e.target === mobileMenuBtn;
            if (!isClickInsideMobile) {
                mobileMenu.classList.add('hidden');
                main.classList.remove('blur-item');
                footer.classList.remove('blur-item');
                body.style.overflow = 'auto';
            }
        }

        if (megaMenu && megaMenu.classList.contains('show-menu')) {
            const isClickInsideMega = e.target.closest('#menu-wrapper') || e.target === desktopMenuIcon;
            if (!isClickInsideMega) {
                megaMenu.classList.remove('show-menu');
                main.classList.remove('blur-item');
                footer.classList.remove('blur-item');
                body.style.overflow = 'auto';
            }
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = initNavBar;
} else {
    initNavBar();
}

const mobileMenuBtn = document.getElementById('mobile-menu-btn');

window.addEventListener('scroll', function () {
    if (window.scrollY === 0) {
        mobileMenuBtn.style.transform = 'translateY(0)';
        mobileMenuBtn.style.opacity = '1';
    } else {
        mobileMenuBtn.style.transform = 'translateY(-100%)';
        mobileMenuBtn.style.opacity = '0';
    }
});
