import { AfterViewInit, Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  private active = 0;
  private refreshInterval: any;
  private lengthItems = 0;
  private slider!: HTMLElement;
  private items!: NodeListOf<HTMLElement>;
  private text!: NodeListOf<HTMLElement>;
  private overlay!: HTMLElement;
  private dots!: NodeListOf<HTMLElement>;
  private nextButton!: HTMLElement;
  private prevButton!: HTMLElement;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initializeSlider();
  }

  initializeSlider(): void {
    this.slider = document.querySelector('#video-wrapper .list')!;
    this.items = document.querySelectorAll('#video-wrapper .list .offer-videos');
    this.text = document.querySelectorAll('#overlay h1');
    this.overlay = document.querySelector('#overlay')!;
    this.dots = document.querySelectorAll('#video-wrapper .video-dots li');
    this.nextButton = document.getElementById('next')!;
    this.prevButton = document.getElementById('prev')!;

    this.lengthItems = this.items.length - 1;

    this.renderer.listen(this.nextButton, 'click', () => {
      this.active = (this.active + 1) <= this.lengthItems ? this.active + 1 : 0;
      this.reloadSlider();
    });

    this.renderer.listen(this.prevButton, 'click', () => {
      this.active = (this.active - 1) >= 0 ? this.active - 1 : this.lengthItems;
      this.reloadSlider();
    });

    this.dots.forEach((dot, index) => {
      this.renderer.listen(dot, 'click', () => {
        this.active = index;
        this.reloadSlider();
      });
    });

    window.addEventListener('resize', () => this.reloadSlider());

    this.refreshInterval = setInterval(() => {
      this.nextButton.click();
    }, 3000);
  }

  reloadSlider(): void {
    if (!this.items.length) return;

    const offsetVideoStandard = this.items[0].offsetLeft;
    const offsetTextStandard = this.text[0].offsetLeft;

    this.slider.style.left = -this.items[this.active].offsetLeft + offsetVideoStandard + 'px';
    this.overlay.style.left = -this.text[this.active].offsetLeft + offsetTextStandard + 'px';

    const lastActiveDot = document.querySelector('#video-wrapper .video-dots li.active');
    if (lastActiveDot) {
      lastActiveDot.classList.remove('active');
    }
    this.dots[this.active].classList.add('active');

    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      this.nextButton.click();
    }, 3000);
  }
}
