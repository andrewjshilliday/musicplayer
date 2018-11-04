import { Component, OnInit, Input } from '@angular/core';
import { MusicService } from 'src/app/music.service';

@Component({
  selector: 'app-media-item-collection-row',
  templateUrl: './media-item-collection-row.component.html',
  styleUrls: ['./media-item-collection-row.component.css']
})
export class MediaItemCollectionRowComponent implements OnInit {

  @Input() items: any;
  @Input() size: number;
  @Input() collectionRelationships: any;
  @Input() divider: boolean;
  @Input() todaysAlbums: boolean;

  constructor(public musicService: MusicService) { }

  ngOnInit() {
  }

}
