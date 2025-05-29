import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('../../pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('../../pages/favorites/favorites.module').then(m => m.FavoritesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
