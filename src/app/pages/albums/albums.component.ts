import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../shared/services/player.service';
import { ApiService } from '../../shared/services/api.service';
import * as $ from 'jquery';

import { Artist } from '../../models/musicKit/artist.model';
import { Album } from '../../models/musicKit/album.model';
import { Rating } from '../../models/musicKit/rating.model';
import { AlbumData } from '../../models/album-data.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit, OnDestroy {

  albumSubscription: Subscription;
  loading: boolean;
  albumDuration: number;
  artistAlbums: Artist;
  relatedAlbums: Album[];
  albumData: AlbumData;
  ratings: Rating[];
  popularity: any;
  isLibraryAlbum: boolean;

  constructor(private route: ActivatedRoute, private router: Router, public playerService: PlayerService, public apiService: ApiService) { }

  ngOnInit() {
    this.albumSubscription = this.route.params.subscribe(params => {
      this.loadAlbum(params['id']);
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    $(window).on('resize', function() {
      this.setEditorialNotesStyle();
    }.bind(this));
  }

  ngOnDestroy(): void {
    this.albumSubscription.unsubscribe();
  }

  async loadAlbum(id: string) {
    this.loading = true;

    this.isLibraryAlbum = id.startsWith('l.');
    this.playerService.album = await this.apiService.album(id, 'artists,tracks');
    this.setEditorialNotesStyle();

    this.loading = false;

    this.artistAlbums = null;
    this.getArtistAlbums();

    this.relatedAlbums = null;
    this.getAlbumData();

    if (this.playerService.authorized) {
      this.getRatings();
    }

    if (this.playerService.album.attributes.artistName === 'Various Artists') {
      this.apiService.getRelationships(this.playerService.album.relationships.tracks.data, 'songs');
    }

    this.albumDuration = 0;

    for (const item of this.playerService.album.relationships.tracks.data) {
      this.albumDuration += item.attributes.durationInMillis;
    }
  }

  async getArtistAlbums() {
    if (this.playerService.album.relationships.artists && this.playerService.album.relationships.artists.data.length) {
      this.artistAlbums = await this.apiService.artist(this.playerService.album.relationships.artists.data[0].id, 'albums');
      const itemIdArray = this.artistAlbums.relationships.albums.data.map(i => i.id);

      if (this.isLibraryAlbum) {
        this.artistAlbums.relationships.albums.data = await this.apiService.libraryAlbums(0, itemIdArray);
      } else {
        this.artistAlbums.relationships.albums.data = await this.apiService.albums(itemIdArray);
      }
    }
  }

  async getAlbumData() {
    if (!this.playerService.album.attributes.url) {
      return;
    }

    this.albumData = await this.apiService.albumData(this.playerService.album.id);

    if (!this.albumData.resources.data.relationships.listenersAlsoBought) {
      return;
    }

    const relatedAlbumsIds = this.albumData.resources.data.relationships.listenersAlsoBought.data.map(i => i.id);
    this.relatedAlbums = await this.apiService.albums(relatedAlbumsIds);

    this.getPopulatity();
  }

  async getRatings() {
    if (this.isLibraryAlbum) {
      return;
    }

    this.ratings = await this.apiService.ratings(this.playerService.album.relationships.tracks.data.map(i => i.id));
  }

  async getPopulatity() {
    this.popularity = [];

    for (const item of this.albumData.resources.included) {
      if (item.type === 'product/album/song') {
        if (item.attributes.popularity >= 0.7) {
          this.popularity.push(item.id);
        }
      }
    }
  }

  setEditorialNotesStyle() {
    if (!this.playerService.album.attributes.editorialNotes) {
      return;
    }

    $(document).ready(function() {
      if ($('#notes')) {
        const height = $(window).height();
        const notesOffset = $('#notes').offset().top;
        const notesParentOffset = $('#notes').parent().offset().top;
        $('#notes').css('max-height', height  - notesOffset + notesParentOffset - 160);
      }
    });
  }

}
