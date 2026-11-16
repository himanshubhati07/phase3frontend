import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';

/** One section of the uploaded page, exactly as written. It is applied to the section's own element (see
 *  design-page.component.html), so the DOM is the page's own and no wrapper element is added. */
@Component({
  selector: '[app-xc-studio-back]',
  standalone: true,
  templateUrl: './xc-studio-back.component.html',
  schemas: [NO_ERRORS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XcStudioBackComponent {}
