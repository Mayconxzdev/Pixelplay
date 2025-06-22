import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadDirective } from './lazy-load.directive';

/**
 * Módulo que declara e exporta as diretivas compartilhadas do aplicativo.
 * 
 * Este módulo deve ser importado em qualquer módulo que necessite utilizar as diretivas
 * compartilhadas, como `LazyLoadDirective`.
 */
@NgModule({
  declarations: [
    LazyLoadDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LazyLoadDirective
  ]
})
export class DirectivesModule { }
