import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { PlayerService } from '../../shared/services/player.service';
import { ApiService } from '../../shared/services/api.service';
import { Utils } from '../../shared/utils';

import { Artist, Album, Song, ArtistData } from '../../shared/models';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit, OnDestroy {

  artistSubscription: Subscription;
  loading: boolean;
  albums: Album[];
  singles: Album[];
  liveAlbums: Album[];
  compilations: Album[];
  appearsOn: Album[];
  topSongs: Song[];
  artistImage: string;
  artistData: ArtistData;
  relatedArtists: Artist[];
  isLibraryArtist: boolean;

  sortOptions = [
    ['recommended', 'Recommended'],
    ['releaseDateAsc', 'Release Date (oldest first)'],
    ['releaseDateDesc', 'Release Date (newest first)']
  ];
  sortAlbums = 'recommended';
  sortSingles = 'recommended';
  sortLiveAlbums = 'recommended';
  sortCompilations = 'recommended';
  sortAppearsOn = 'recommended';

  constructor(private route: ActivatedRoute, private router: Router, public playerService: PlayerService, public apiService: ApiService) { }

  ngOnInit() {
    this.artistSubscription = this.route.params.subscribe(params => {
      this.loadArtist(params['id']);
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    window.addEventListener('scroll', function() {
      const header = document.getElementById('header');
      const image = document.getElementById('image');

      if (!image) {
        return;
      }

      const divposition = image.getBoundingClientRect();

      if (divposition.top + divposition.height < 0) {
        header.classList.add('header-expanded');
      } else {
        header.classList.remove('header-expanded');
      }
    }, true);
  }

  ngOnDestroy(): void {
    this.artistSubscription.unsubscribe();
  }

  async loadArtist(id: string) {
    this.loading = true;

    this.isLibraryArtist = id.startsWith('r.');
    this.playerService.artist = await this.apiService.artist(id, 'albums,playlists').toPromise();
    await this.getArtistData();

    this.loading = false;

    this.playerService.playlists = null;
    if (this.playerService.artist.relationships && this.playerService.artist.relationships.playlists) {
      this.playerService.playlists = this.playerService.artist.relationships.playlists.data;
    }

    this.getArtistRelationships();
    this.getRelatedArtists();

    this.sortAlbums = sessionStorage.getItem('albumsSortOrder') || 'recommended';
    this.sortSingles = sessionStorage.getItem('singlesSortOrder') || 'recommended';
    this.sortLiveAlbums = sessionStorage.getItem('liveAlbumsSortOrder') || 'recommended';
    this.sortCompilations = sessionStorage.getItem('compilationsSortOrder') || 'recommended';
    this.sortAppearsOn = sessionStorage.getItem('appearsOnSortOrder') || 'recommended';
  }

  sortItems(items: any, sort: string, type: string) {
    const sortItems = Object.assign([], items);
    sessionStorage.setItem(`${type}SortOrder`, sort);

    switch (sort) {
      case 'recommended': {
        return sortItems;
      }
      case 'releaseDateAsc': {
        return sortItems.sort(
          (a, b) => new Date(a.attributes.releaseDate).getTime() - new Date(b.attributes.releaseDate).getTime()
        );
      }
      case 'releaseDateDesc': {
        return sortItems.sort(
          (a, b) => new Date(b.attributes.releaseDate).getTime() - new Date(a.attributes.releaseDate).getTime()
        );
      }
    }
  }

  getArtistRelationships() {
    if (this.isLibraryArtist) {
      return;
    }

    const ids = this.playerService.artist.relationships.albums.data.filter(i => i.type === 'albums').map(i => i.id);
    this.apiService.albums(ids, 'artists').subscribe(res => {
      this.playerService.artist.relationships.albums.data = res;
      this.apiService.getRelationships(this.playerService.artist.relationships.albums.data, 'albums');
    });
  }

  async getArtistData(): Promise<any> {
    if (this.isLibraryArtist) {
      this.albums = this.playerService.artist.relationships.albums.data;
      return;
    }

    this.artistData = await this.apiService.artistData(this.playerService.artist.id).toPromise();
    this.artistImage = this.artistData.imageUrl;

    let topSongs: string[];
    let albumsIds: string[];
    let singlesIds: string[];
    let liveAlbumsIds: string[];
    let compilationsIds: string[];
    let appearsOnIds: string[];

    for (const item of this.artistData.resources.included) {
      if (item.id.match(this.playerService.artist.id + '/topSongs')) {
        topSongs = item.relationships.content.data.map(i => i.id);
        continue;
      }
      if (item.id.match(this.playerService.artist.id + '/fullAlbums')) {
        albumsIds = item.relationships.content.data.map(i => i.id);
        continue;
      }
      if (item.id.match(this.playerService.artist.id + '/singleAlbums')) {
        singlesIds = item.relationships.content.data.map(i => i.id);
        continue;
      }
      if (item.id.match(this.playerService.artist.id + '/liveAlbums')) {
        liveAlbumsIds = item.relationships.content.data.map(i => i.id);
        continue;
      }
      if (item.id.match(this.playerService.artist.id + '/compilationAlbums')) {
        compilationsIds = item.relationships.content.data.map(i => i.id);
        continue;
      }
      if (item.id.match(this.playerService.artist.id + '/appearsOnAlbums')) {
        appearsOnIds = item.relationships.content.data.map(i => i.id);
        continue;
      }
      if (topSongs && albumsIds && singlesIds && liveAlbumsIds && compilationsIds) {
        break;
      }
    }

    this.albums = [];
    this.singles = [];
    this.liveAlbums = [];
    this.compilations = [];
    this.appearsOn = [];

    if (appearsOnIds && appearsOnIds.length) {
      this.getAppearsOn(appearsOnIds);
    }

    for (const item of this.playerService.artist.relationships.albums.data) {
      if (albumsIds && albumsIds.indexOf(item.id) > -1) {
        this.albums.push(item);
        continue;
      }
      if (singlesIds && singlesIds.indexOf(item.id) > -1) {
        this.singles.push(item);
        continue;
      }
      if (liveAlbumsIds && liveAlbumsIds.indexOf(item.id) > -1) {
        this.liveAlbums.push(item);
        continue;
      }
      if (compilationsIds && compilationsIds.indexOf(item.id) > -1) {
        this.compilations.push(item);
        continue;
      }
      if (appearsOnIds && appearsOnIds.indexOf(item.id) > -1) {
        continue;
      }
      this.albums.push(item);
    }

    if (topSongs) {
      this.topSongs = await this.apiService.songs(topSongs, 'albums').toPromise();
    }
  }

  getRelatedArtists() {
    this.relatedArtists = null;

    if (!this.artistData || !this.artistData.resources.data.relationships.artistContemporaries ||
      !this.artistData.resources.data.relationships.artistContemporaries.data) {
      return;
    }

    const ids = this.artistData.resources.data.relationships.artistContemporaries.data.map(i => i.id);
    this.apiService.artists(ids).subscribe(res => {
      this.relatedArtists = res;
      this.getArtistArtwork(this.relatedArtists);
    });
  }

  getAppearsOn(ids: string[]) {
    this.apiService.albums(ids).subscribe(res => this.appearsOn = res);
  }

  getArtistArtwork(artists: Artist[]) {
    const ids = artists.map(a => a.id);
    const observables = [];
    let offset = 0;

    while (ids.slice(offset, offset + 30).length) {
      observables.push(this.apiService.artistsData(ids.slice(offset, offset + 30), true).subscribe(res => {
        for (const a of res) {
          if (a.imageUrl) {
            for (const artist of artists) {
              if (artist.id === a.id) {
                artist.attributes.artwork = this.playerService.generateArtwork(a.imageUrl);
              }
            }
          }
        }
      }));

      offset += 30;
    }

    forkJoin(observables);
  }

  formatDate(date: string) {
    return Utils.formatDate(date);
  }

}
