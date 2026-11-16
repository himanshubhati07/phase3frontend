import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { mountInert } from './design-inert';
import { INERT_HTML } from './xc-studio-src.component.inert';

/** An inert <script> block of the uploaded page, put into the page where this element stands (see design-inert.ts). */
@Component({
  selector: 'app-xc-studio-src',
  standalone: true,
  template: '',
  schemas: [NO_ERRORS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XcStudioSrcComponent implements AfterViewInit {
  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    mountInert(this.host.nativeElement, INERT_HTML);
  }
}
