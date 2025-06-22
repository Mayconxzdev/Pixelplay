import { Directive, ElementRef, Input, OnInit, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  @Input('appLazyLoad') imageUrl: string | undefined;
  @Input() altText = '';
  @Input() placeholderColor = '#e0e0e0';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    this.setupLazyLoading();
  }

  private setupLazyLoading() {
    if (!this.imageUrl) {
      this.setPlaceholder();
      return;
    }

    // Configura um placeholder
    this.setPlaceholder();

    // Cria uma nova imagem para pré-carregar
    const img = new Image();
    
    // Quando a imagem carregar
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.imageUrl || '');
      this.renderer.addClass(this.el.nativeElement, 'loaded');
      this.renderer.setStyle(this.el.nativeElement, 'background', 'transparent');
    };

    // Em caso de erro
    img.onerror = () => {
      this.setPlaceholder();
      this.renderer.addClass(this.el.nativeElement, 'error');
    };

    // Inicia o carregamento
    img.src = this.imageUrl;
  }


  private setPlaceholder() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.placeholderColor);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.3s ease');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.7');
    
    // Adiciona um indicador de carregamento
    this.renderer.setAttribute(this.el.nativeElement, 'alt', this.altText || 'Carregando...');
  }
}
