import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import ResizeObserver from 'resize-observer-polyfill';

@Component({
  selector: 'app-media-item-collection-carousel',
  templateUrl: './media-item-collection-row.component.html',
  styleUrls: ['./media-item-collection-row.component.scss']
})
export class MediaItemCollectionRowCarouselComponent implements OnInit, AfterViewInit {

  @Input() collection: any;
  @Input() size: number;
  @ViewChild('row') row: ElementRef;
  @ViewChild('leftIcon') leftIcon: ElementRef;
  @ViewChild('rightIcon') rightIcon: ElementRef;
  artwork: HTMLElement;

  constructor(public playerService: PlayerService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.artwork = this.row.nativeElement.getElementsByTagName(`img`)[0]?.parentElement;
    this.positionScrollButtons();

    if (this.leftDisabled()) {
      this.leftIcon.nativeElement.classList.add('disabled');
    }
    if (this.rightDisabled()) {
      this.rightIcon.nativeElement.classList.add('disabled');
    }

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(() => {
        this.positionScrollButtons();
      });
    });
    resizeObserver.observe(this.row.nativeElement);
  }

  scroll(right: boolean) {
    if (right) {
      this.rightIcon.nativeElement.classList.add('disabled');
      this.leftIcon.nativeElement.classList.remove('disabled');
      this.row.nativeElement.scrollLeft += this.row.nativeElement.offsetWidth;
    } else {
      this.leftIcon.nativeElement.classList.add('disabled');
      this.rightIcon.nativeElement.classList.remove('disabled');
      this.row.nativeElement.scrollLeft -= this.row.nativeElement.offsetWidth;
    }

    setTimeout(() => {
      if (right && !this.rightDisabled()) {
        this.rightIcon.nativeElement.classList.remove('disabled');
      } else if (!right && !this.leftDisabled()) {
        this.leftIcon.nativeElement.classList.remove('disabled');
      }
    }, 600);
  }

  leftDisabled(): boolean {
    return this.row.nativeElement.scrollLeft === 0;
  }

  rightDisabled(): boolean {
    return this.row.nativeElement.lastElementChild.offsetLeft < this.row.nativeElement.scrollLeft + this.row.nativeElement.offsetWidth;
  }

  positionScrollButtons() {
    if (!this.leftIcon || !this.rightIcon || !this.artwork) { return; }
    this.leftIcon.nativeElement.firstChild.style.top = `${this.artwork.offsetHeight / 2 - 28}px`;
    this.rightIcon.nativeElement.firstChild.style.top = `${this.artwork.offsetHeight / 2 - 28}px`;
  }

}
