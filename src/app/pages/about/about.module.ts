import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPage } from './about.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPage
  }
];

@NgModule({
  imports: [
    AboutPage,
    RouterModule.forChild(routes)
  ]
})
export class AboutPageModule {}
