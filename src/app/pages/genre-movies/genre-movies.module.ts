import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenreMoviesPageRoutingModule } from './genre-movies-routing.module';

import { GenreMoviesPage } from './genre-movies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenreMoviesPageRoutingModule
  ],
  declarations: [GenreMoviesPage]
})
export class GenreMoviesPageModule {}
