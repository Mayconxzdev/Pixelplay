import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

// Components
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { CategoriesComponent } from './components/categories/categories.component';

// Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';
import { GenresPipe } from './pipes/genres.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    // Importa os pipes standalone
    DateFormatPipe,
    GenresPipe,
    TruncatePipe,
    // Importa os componentes standalone
    MovieCardComponent,
    MovieListComponent,
    CategoriesComponent
  ],
  exports: [
    // Exporta os componentes standalone
    MovieCardComponent,
    MovieListComponent,
    CategoriesComponent,
    // Exporta os pipes standalone
    TruncatePipe,
    DateFormatPipe,
    GenresPipe,
    // Exporta módulos necessários
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class SharedModule { }
