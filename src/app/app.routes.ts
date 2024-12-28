import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DetailComponent } from './components/detail/detail.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent},
    {path: 'detail', component: DetailComponent},
];
