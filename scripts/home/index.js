document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.offer-videos');

    videos.forEach(video => {
        video.addEventListener('mouseenter', () => {
            video.play();
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    let slider = document.querySelector('#video-wrapper .list');
    let items = document.querySelectorAll('#video-wrapper .list .offer-videos');
    let text = document.querySelectorAll('#overlay h1');
    let overlay = document.querySelector('#overlay');
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
        const offsetVideoStandard = items[0].offsetLeft;
        const  offsetTextStandard = text[0].offsetLeft;
        slider.style.left = -items[active].offsetLeft + offsetVideoStandard + 'px';
        overlay.style.left = -text[active].offsetLeft + offsetTextStandard + 'px';
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

    const copy = document.querySelector(".logos-slide").cloneNode(true);
    document.querySelector(".logos").appendChild(copy);
});

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});