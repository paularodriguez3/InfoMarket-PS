document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.fi-rr-menu-burger');
    const mobileMenu = document.querySelector('#menu-wrapper');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const videos = document.querySelectorAll('.offer-videos');


    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
        main.classList.toggle('blur-item');
        footer.classList.toggle('blur-item');
    });

    videos.forEach(video => {
        video.addEventListener('mouseenter', () => {
            video.play();
        });
    });

    let slider = document.querySelector('#video-wrapper .list');
    let items = document.querySelectorAll('#video-wrapper .list .offer-videos');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let dots = document.querySelectorAll('#video-wrapper .video-dots li');

    let lengthItems = items.length - 1;
    let active = 0;
    next.onclick = function(){
        active = active + 1 <= lengthItems ? active + 1 : 0;
        reloadSlider();
    }
    prev.onclick = function(){
        active = active - 1 >= 0 ? active - 1 : lengthItems;
        reloadSlider();
    }
    let refreshInterval = setInterval(()=> {next.click()}, 3000);
    function reloadSlider(){
        const offsetStandard = items[0].offsetLeft;
        slider.style.left = -items[active].offsetLeft + offsetStandard + 'px';
        let last_active_dot = document.querySelector('#video-wrapper .video-dots li.active');
        last_active_dot.classList.remove('active');
        dots[active].classList.add('active');

        clearInterval(refreshInterval);
        refreshInterval = setInterval(()=> {next.click()}, 3000);
    }

    dots.forEach((li, key) => {
        li.addEventListener('click', ()=>{
            active = key;
            reloadSlider();
        })
    })
    window.onresize = function(event) {
        reloadSlider();
    };
});
