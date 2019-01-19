import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MusicService } from '../music.service';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-curators',
  templateUrl: './curators.component.html',
  styleUrls: ['./curators.component.css']
})
export class CuratorsComponent implements OnInit {

  curatorSubscription: Subscription;
  loading: boolean;
  curator: any;
  curatorPlaylists: any;
  @Input() featuredPlaylistId: string;
  genre: string;
  featuredPlaylist: any;
  mostPlayed: any;

  filters: Array<string> = [ 'All', 'Essentials', 'Next Steps', 'Deep Cuts', 'Influences', 'Inspired' ];

  nextPlaylistsUrl: string;
  getNextPlaylists = true;
  loadingPlaylists: boolean;

  constructor(private route: ActivatedRoute, private router: Router, public musicService: MusicService) { }

  ngOnInit() {
    this.curatorSubscription = this.route.params.subscribe(params => {
      this.loadCurator(params['type'], params['id']);
    });
  }

  async loadCurator(type: string, id: string) {
    this.loading = true;

    if (type === 'apple') {
      this.curator = await this.musicService.musicKit.api.appleCurator(id);
      this.curatorPlaylists = await this.musicService.musicKit.api.playlists(this.curator.relationships.playlists.data.map(i => i.id));
    } else {
      this.curator = await this.musicService.musicKit.api.curator(id);
      this.curatorPlaylists = await this.musicService.musicKit.api.playlists(this.curator.relationships.playlists.data.map(i => i.id));
    }

    if (this.curator.relationships.playlists.next) {
      this.getNextPlaylists = true;
      this.nextPlaylistsUrl = this.curator.relationships.playlists.next;
      this.loadPlaylists();
    }

    if (this.curator.type === 'apple-curators') {
      this.getAppleCuratorInfo();
    }

    if (this.genre) {
      this.getMostPlayed();
    }

    if (!this.featuredPlaylistId) {
      this.featuredPlaylistId = this.curatorPlaylists[0].id;
    }

    this.featuredPlaylist = await this.musicService.musicKit.api.playlist(this.featuredPlaylistId);

    this.loading = false;
  }

  async loadPlaylists(): Promise<any> {
    this.loadingPlaylists = true;

    if (this.getNextPlaylists && this.nextPlaylistsUrl) {
      this.getNextPlaylists = false;

      const playlists = await fetch('https://api.music.apple.com' + this.nextPlaylistsUrl,
        { headers: Utils.appleApiHeaders() }).then(res => res.json());

      if (playlists && playlists.data && playlists.data) {
        for (const playlist of playlists.data) {
          this.curatorPlaylists.push(playlist);
        }

        this.nextPlaylistsUrl = playlists.next;

        if (this.nextPlaylistsUrl) {
          if (Number(this.nextPlaylistsUrl.substring(this.nextPlaylistsUrl.indexOf('=') + 1, this.nextPlaylistsUrl.length)) % 30 !== 0) {
            this.getNextPlaylists = true;
            this.loadPlaylists();
            return;
          }
        }
      }

      this.getNextPlaylists = true;
    }

    this.loadingPlaylists = false;
  }

  async getMostPlayed() {
    this.mostPlayed = await this.musicService.musicKit.api.charts(null, { genre: this.genre, types: 'albums,songs' });

    this.getItemRelationships(this.mostPlayed.albums[0].data, 'albums');
    this.getItemRelationships(this.mostPlayed.songs[0].data, 'songs');
  }

  getAppleCuratorInfo() {
    switch (this.curator.id) {
      case '976439528': { /* blues */
        this.featuredPlaylistId = 'pl.a9faca07cf8f47e19f1819b0f5a2e765';
        this.genre = '2';
        break;
      }
      case '988581516': { /* rock */
        this.featuredPlaylistId = 'pl.c690c42617be4e90b603187f3ce265e5';
        this.genre = '21';
        break;
      }
      case '988556214': { /* alternative */
        this.featuredPlaylistId = 'pl.0b593f1142b84a50a2c1e7088b3fb683';
        this.genre = '20';
        break;
      }
      case '988588080': { /* pop */
        this.featuredPlaylistId = 'pl.5ee8333dbe944d9f9151e97d92d1ead9';
        this.genre = '14';
        break;
      }
      case '989061185': { /* hip-hop */
        this.featuredPlaylistId = 'pl.abe8ba42278f4ef490e3a9fc5ec8e8c5';
        this.genre = '18';
        break;
      }
      case '976439542': { /* jazz */
        this.featuredPlaylistId = 'pl.07405f59596b402385451fa14695eec4';
        this.genre = '11';
        break;
      }
      case '988583890': { /* r&b/soul */
        this.featuredPlaylistId = 'pl.b7ae3e0a28e84c5c96c4284b6a6c70af';
        this.genre = '15';
        break;
      }
      case '989074778': { /* dance */
        this.featuredPlaylistId = 'pl.6bf4415b83ce4f3789614ac4c3675740';
        this.genre = '17';
        break;
      }
      case '988658201': { /* metal */
        this.featuredPlaylistId = 'pl.51c1d571cc7b484eb1dead1939811f2d';
        this.genre = '1153';
        break;
      }
      case '989076708': { /* electronic */
        this.featuredPlaylistId = 'pl.4705ab1ed97c4f4bb54f48940faf5623';
        this.genre = '7';
        break;
      }
      case '989071074': { /* classical */
        this.featuredPlaylistId = 'pl.66c17ed5cc754856b944a9150483e375';
        this.genre = '5';
        break;
      }
      case '976439534': { /* country */
        this.featuredPlaylistId = 'pl.87bb5b36a9bd49db8c975607452bfa2b';
        this.genre = '6';
        break;
      }
      case '982347996': { /* new-artists */
        this.featuredPlaylistId = 'pl.704f234023a543dfb4bfb34b426c27d1';
        break;
      }
      case '988658197': { /* k-pop */
        this.featuredPlaylistId = 'pl.48229b41bbfc47d7af39dae8e8b5276e';
        this.genre = '51';
        break;
      }
      case '976439552': { /* reggae */
        this.featuredPlaylistId = 'pl.e75fb4f0f6f649a89f7c28ef4cc0442f';
        this.genre = '24';
        break;
      }
      case '988578699': { /* singer/songwriter */
        this.featuredPlaylistId = 'pl.8e78f32951a4462f9f4d369c006bc97d';
        this.genre = '10';
        break;
      }
      case '988656348': { /* african */
        this.featuredPlaylistId = 'pl.a0794db8bc6f45888834fa708a674987';
        break;
      }
      case '976439529': { /* inspirational */
        this.featuredPlaylistId = 'pl.fecfa8a26ea44ad581d4fe501892c8ff';
        this.genre = '22';
        break;
      }
      case '976439587': { /* world */
        this.featuredPlaylistId = 'pl.ae51374a1fc6439596fdf79a575a871b';
        this.genre = '19';
        break;
      }
      case '988578275': { /* stage & screen */
        this.featuredPlaylistId = 'pl.244c649d1443463c96da02b6726b04ae';
        this.genre = '16';
        break;
      }
      case '1053601584': { /* christmas */
        this.featuredPlaylistId = 'pl.b0e04e25887741ea845e1d5c88397fd4';
        break;
      }
      case '989066661': { /* childrens-music */
        this.featuredPlaylistId = 'pl.0e75ae3fb97a4fe2aee9b6bbedd020ff';
        this.genre = '4';
        break;
      }
    }
  }

  async getItemRelationships(collection: any, type: string) {
    let itemIdArray: any;
    let results: any;

    switch (type) {
      case 'albums': {
        itemIdArray = collection.map(i => i.id);
        results = await this.musicService.musicKit.api.albums(itemIdArray, { include: 'artists' });

        for (const item of collection) {
          let index = 0;

          for (const result of results) {
            if (item.id === result.id && result.relationships.artists.data.length) {
              collection[index].relationships = result.relationships;
              break;
            }

            index++;
          }
        }

        break;
      }
      case 'playlists': {
        itemIdArray = collection.map(i => i.id);
        results = await this.musicService.musicKit.api.playlists(itemIdArray, { include: 'curators' });

        for (const item of collection) {
          let index = 0;

          for (const result of results) {
            if (item.id === result.id && result.relationships.curator.data.length) {
              collection[index].relationships = result.relationships;
              break;
            }

            index++;
          }
        }

        break;
      }
      case 'songs': {
        itemIdArray = collection.map(i => i.id);
        results = await this.musicService.musicKit.api.songs(itemIdArray, { include: 'artists,albums' });

        for (const item of collection) {
          for (const result of results) {
            if (item.id === result.id) {
              item.relationships = result.relationships;
              break;
            }
          }
        }

        break;
      }
    }
  }

}
