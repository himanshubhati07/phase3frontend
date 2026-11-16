import { AfterViewInit, ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { loadDesignScripts } from './design-scripts';
import { restoreStyleText } from './design-style-text';
import { XcLoginSectionComponent } from './xc-login-section.component';
import { AppHeaderComponent } from './app-header.component';
import { NotifPanelSectionComponent } from './notif-panel-section.component';
import { AppBodySectionComponent } from './app-body-section.component';
import { KgSrcComponent } from './kg-src.component';
import { XcStudioHostSectionComponent } from './xc-studio-host-section.component';
import { XcStudioBackComponent } from './xc-studio-back.component';
import { XcStudioSrcComponent } from './xc-studio-src.component';

/** The whole uploaded page: every section in document order, inside the page's own wrapper tags. */
@Component({
  selector: 'app-design-page',
  standalone: true,
  imports: [XcLoginSectionComponent, AppHeaderComponent, NotifPanelSectionComponent, AppBodySectionComponent, KgSrcComponent, XcStudioHostSectionComponent, XcStudioBackComponent, XcStudioSrcComponent],
  templateUrl: './design-page.component.html',
  schemas: [NO_ERRORS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignPageComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    restoreStyleText();
    loadDesignScripts(["/design-scripts/handlers.js", "/design-scripts/01.js", "/design-scripts/02.js", "/design-scripts/03.js", "/design-scripts/04.js", "/design-scripts/05.js", "/design-scripts/06.js", "/design-scripts/07.js", "/design-scripts/08.js", "/design-scripts/09.js"]);
  }
}
