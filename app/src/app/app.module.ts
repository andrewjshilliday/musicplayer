import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { SentryErrorHandler } from './app.sentry';
import { ApiCache } from './shared/cache/api/api-cache.service';
import { ApiCacheInterceptor } from './shared/cache/api/api-cache.interceptor';
import { PlayerModule } from './player/player.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { BrowseComponent } from './views/browse/browse.component';
import { ForYouComponent } from './views/for-you/for-you.component';
import { LibraryComponent } from './views/library/library.component';
import { SearchComponent } from './views/search/search.component';
import { ArtistsComponent } from './views/artists/artists.component';
import { AlbumsComponent } from './views/albums/albums.component';
import { PlaylistsComponent } from './views/playlists/playlists.component';
import { CuratorsComponent } from './views/curators/curators.component';
import { SettingsComponent } from './views/settings/settings.component';
import { environment } from '../environments/environment';

export function initApp(http: HttpClient) {
  return async () => {
    const resp = await http.get<any>(`https://ut8obu95ge.execute-api.eu-west-1.amazonaws.com/dev/auth?service=apple-music`).toPromise();
    environment.appleMusicDevToken = resp.access_token;
  };
}

@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    ForYouComponent,
    LibraryComponent,
    SearchComponent,
    ArtistsComponent,
    AlbumsComponent,
    PlaylistsComponent,
    CuratorsComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    PlayerModule,
    SharedModule,
    RouterModule.forRoot([
      { path: 'browse', component: BrowseComponent },
      { path: 'foryou', component: ForYouComponent },
      { path: 'search', component: SearchComponent },
      { path: 'artists/:id', component: ArtistsComponent },
      { path: 'albums/:id', component: AlbumsComponent },
      { path: 'playlists/:id', component: PlaylistsComponent },
      { path: 'curators/:type/:id', component: CuratorsComponent },
      { path: 'library', redirectTo: 'library/recently-added', pathMatch: 'full' },
      { path: 'library/:type', component: LibraryComponent },
      { path: 'library/artists/:id', component: ArtistsComponent },
      { path: 'library/albums/:id', component: AlbumsComponent },
      { path: 'library/playlists/:id', component: PlaylistsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'browse', pathMatch: 'full' },
      { path: '**', redirectTo: 'browse', pathMatch: 'full' }
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    // { provide: ErrorHandler, useClass: SentryErrorHandler },
    ApiCache,
    { provide: HTTP_INTERCEPTORS, useClass: ApiCacheInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initApp, multi: true, deps: [HttpClient] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
