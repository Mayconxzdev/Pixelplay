import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenreMoviesPage } from './genre-movies.page';

const routes: Routes = [
  {
    path: '',
    component: GenreMoviesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenreMoviesPageRoutingModule {}
