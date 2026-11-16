import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DesignPageComponent } from './design-page.component';

describe('DesignPageComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [DesignPageComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(DesignPageComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
