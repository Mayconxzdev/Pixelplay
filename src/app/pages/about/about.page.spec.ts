import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { AboutPage, TeamMember } from './about.page';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { LazyLoadDirective } from '../../shared/directives/lazy-load.directive';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        RouterTestingModule
      ],
      declarations: [
        AboutPage,
        LazyLoadDirective
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have team members', () => {
    expect(component.teamMembers.length).toBeGreaterThan(0);
  });

  it('should have technologies', () => {
    expect(component.technologies.length).toBeGreaterThan(0);
  });

  it('should handle image error', () => {
    // Create a test member
    const member: TeamMember = { 
      name: 'Test User',
      role: 'Test Role',
      description: 'Test Description',
      skills: ['Test'],
      socialLinks: [],
      imageError: false
    };
    
    // Create a mock event
    const event = new Event('error');
    Object.defineProperty(event, 'target', {
      value: { style: { display: 'none' } },
      writable: true
    });
    
    // Call the method with correct number of arguments
    component.handleImageError(event, member);
    
    // Verify the error was handled
    expect(member.imageError).toBeTrue();
  });

  it('should get initials from name', () => {
    const name = 'Maycon Ferreira';
    const initials = component.getInitials(name);
    expect(initials).toBe('MF');
  });

  it('should scroll to top', () => {
    // Create a spy for window.scrollTo
    const scrollToSpy = spyOn(window, 'scrollTo');
    
    // Call the method
    component.scrollToTop();
    
    // Verify it was called with the right arguments
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  it('should handle null or undefined scrollTo', () => {
    // Save original
    const originalScrollTo = window.scrollTo;
    
    // Test with scrollTo being null
    (window as any).scrollTo = null;
    expect(() => component.scrollToTop()).not.toThrow();
    
    // Test with scrollTo being undefined
    (window as any).scrollTo = undefined;
    expect(() => component.scrollToTop()).not.toThrow();
    
    // Restore original
    window.scrollTo = originalScrollTo;
  });

  it('should toggle theme', () => {
    const initialTheme = component.isDarkMode;
    component.toggleTheme();
    expect(component.isDarkMode).toBe(!initialTheme);
    
    // Toggle again
    component.toggleTheme();
    expect(component.isDarkMode).toBe(initialTheme);
  });

  it('should show back to top button when scrolled', fakeAsync(() => {
    // Initial state should be false
    expect(component.showBackToTop).toBeFalse();
    
    // Simulate scroll
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(500);
    window.dispatchEvent(new Event('scroll'));
    
    // Wait for the debounce and animation frame
    tick(150); // Debounce time
    flush(); // Execute all pending async operations
    
    // Now the value should be updated
    expect(component.showBackToTop).toBeTrue();
  }));

  it('should handle reduced motion preference', () => {
    // Save original matchMedia
    const originalMatchMedia = window.matchMedia;
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    });

    component.ngOnInit();
    expect(document.documentElement.classList.contains('reduced-motion')).toBeTrue();
  });
});
