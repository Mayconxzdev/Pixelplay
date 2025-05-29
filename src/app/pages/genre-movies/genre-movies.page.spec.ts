import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenreMoviesPage } from './genre-movies.page';

describe('GenreMoviesPage', () => {
  let component: GenreMoviesPage;
  let fixture: ComponentFixture<GenreMoviesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
