import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LazyLoadDirective } from './lazy-load.directive';

// Componente de teste
@Component({
  template: `
    <img 
      [appLazyLoad]="imageUrl" 
      [alt]="altText"
      [placeholderColor]="placeholderColor"
    >
  `
})
class TestComponent {
  imageUrl = 'test.jpg';
  altText = 'Test image';
  placeholderColor = '#e0e0e0';
}

describe('LazyLoadDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let imgElement: HTMLImageElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, LazyLoadDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    imgElement = fixture.nativeElement.querySelector('img');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(imgElement).toBeTruthy();
  });

  it('should set placeholder styles initially', () => {
    expect(imgElement.style.backgroundColor).toBe('rgb(224, 224, 224)');
    expect(imgElement.style.opacity).toBe('0.7');
    expect(imgElement.style.transition).toContain('opacity 0.3s ease');
  });

  it('should handle image load', () => {
    const loadEvent = new Event('load');
    imgElement.dispatchEvent(loadEvent);
    
    expect(imgElement.style.background).toBe('transparent');
    expect(imgElement.classList.contains('loaded')).toBeTrue();
  });

  it('should handle image error', () => {
    const errorEvent = new Event('error');
    imgElement.dispatchEvent(errorEvent);
    
    expect(imgElement.classList.contains('error')).toBeTrue();
  });
});
