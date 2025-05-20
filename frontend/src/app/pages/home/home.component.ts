import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    TranslatePipe,
    NgForOf
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  private observer!: IntersectionObserver;
  private refreshInterval: any;
  private active = 0;
  private lengthItems = 0;

  overlayTitles: string[] = [
    'HOME.SECTION_COMPUTING',
    'HOME.SECTION_GAMING',
    'HOME.SECTION_PHONES',
    'HOME.SECTION_TVS',
    'HOME.SECTION_APPLIANCES'
  ];

  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @ViewChild('overlayContainer') overlayContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setupObserver();
    this.setupSlider();
    this.setupAutoAdvance();
    this.setupHoverPlay();
  }

  setupObserver(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    document.querySelectorAll('.hidden').forEach(el => this.observer.observe(el));
  }

  setupHoverPlay(): void {
    const videos = document.querySelectorAll<HTMLVideoElement>('.offer-videos');
    videos.forEach(video =>
      video.addEventListener('mouseenter', () => {
        video.play();
      })
    );
  }

  setupSlider(): void {
    const slider = this.sliderContainer.nativeElement as HTMLElement;
    const items = slider.querySelectorAll('.offer-videos') as NodeListOf<HTMLElement>;
    const text = this.overlayContainer.nativeElement.querySelectorAll('h1') as NodeListOf<HTMLElement>;
    const dots = document.querySelectorAll<HTMLElement>('.video-dots li');
    const next = document.getElementById('next')!;
    const prev = document.getElementById('prev')!;

    this.lengthItems = items.length - 1;

    const reloadSlider = () => {
      const offsetVideoStandard = items[0].offsetLeft;
      const offsetTextStandard = text[0].offsetLeft;

      slider.style.left = -items[this.active].offsetLeft + offsetVideoStandard + 'px';
      this.overlayContainer.nativeElement.style.left = -text[this.active].offsetLeft + offsetTextStandard + 'px';

      document.querySelector('.video-dots li.active')?.classList.remove('active');
      dots[this.active].classList.add('active');

      clearInterval(this.refreshInterval);
      this.setupAutoAdvance();
    };

    this.renderer.listen(next, 'click', () => {
      this.active = (this.active + 1 <= this.lengthItems) ? this.active + 1 : 0;
      reloadSlider();
    });

    this.renderer.listen(prev, 'click', () => {
      this.active = (this.active - 1 >= 0) ? this.active - 1 : this.lengthItems;
      reloadSlider();
    });

    dots.forEach((dot, key) => {
      this.renderer.listen(dot, 'click', () => {
        this.active = key;
        reloadSlider();
      });
    });

    window.addEventListener('resize', reloadSlider);
  }

  setupAutoAdvance(): void {
    const next = document.getElementById('next')!;
    if (!next) return;

    this.refreshInterval = setInterval(() => next.click(), 3000);
  }
}


