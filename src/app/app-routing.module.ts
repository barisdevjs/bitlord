import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MarketsComponent } from './components/markets/markets.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MarketDetailsComponent } from './components/market-details/market-details.component';
import { BalancesComponent } from './components/balances/balances.component';
import { OpenOrdersComponent } from './components/open-orders/open-orders.component';
import { WebSocketComponent } from './components/web-socket/web-socket.component';

const routes: Routes = [ 
  { path: '', component: HomeComponent },
  { path: 'profile',  component : ProfileComponent, canActivate:[AuthGuard]}, 
  { path: 'profile/openorders',  component : OpenOrdersComponent, canActivate:[AuthGuard]}, 
  { path: 'profile/balances',  component : BalancesComponent, canActivate:[AuthGuard]}, 
  { path: 'login',  component : LoginComponent },
  { path: 'logout',  component : LogoutComponent, canActivate:[AuthGuard] }, 
  { path: 'markets',  component : MarketsComponent }, 
  { path: 'markets/:marketCode', component: MarketDetailsComponent },
  { path: 'websocket', component: WebSocketComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
