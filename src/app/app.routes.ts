import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DetailComponent } from './components/detail/detail.component';
import { PlayerComponent } from './components/player/player.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent},
    {path: 'player', component: PlayerComponent},
    {path: 'detail', component: DetailComponent},
];
