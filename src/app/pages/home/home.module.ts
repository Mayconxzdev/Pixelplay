import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Ionic
import { IonicModule } from '@ionic/angular';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

// Pages
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    SharedModule,
    HomePageRoutingModule,
    // Importa o HomePage como standalone
    HomePage
  ]
})
export class HomePageModule {}
