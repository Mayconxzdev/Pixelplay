import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MovieDetailsPageRoutingModule } from './movie-details-routing.module';
import { MovieDetailsPage } from './movie-details.page';

// Components
import { SharedModule } from '../../shared/shared.module';

// Pipes
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { GenresPipe } from '../../shared/pipes/genres.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
    MovieDetailsPageRoutingModule,
    // Importa os pipes standalone
    DateFormatPipe,
    GenresPipe,
    // Importa o MovieDetailsPage como standalone
    MovieDetailsPage
  ]
})
export class MovieDetailsPageModule {}
