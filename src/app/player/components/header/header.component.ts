import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../../shared/services/player.service';
import { ApiService } from '../../../shared/services/api.service';
import * as $ from 'jquery';

import { SearchHints } from '../../../shared/models/musicKit/search-hints.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchHints: SearchHints;

  constructor(private router: Router, public playerService: PlayerService, public apiService: ApiService) { }

  ngOnInit() {
    const self = this;
    $('.search-control .icon').click(function() {
      if ($('#search-control').hasClass('active') && $('#search-bar').val()) {
        self.search($('#search-bar').val());
      } else {
        $(this).parent().toggleClass('active');
        $('#search-bar').select();

        if (!$('#search-bar').is(':focus')) {
          $('#search-bar').focus();
        }
      }
    });

    $('#search-control').focusout(function() {
      /* $(this).removeClass('active'); */
    });
  }

  search(term: string) {
    this.router.navigate(['/search'], { queryParams: { term: term } });
    $('#search-bar').blur();
  }

  getSearchHints(term: string) {
    if (term !== '') {
      this.apiService.searchHints(term, 10).subscribe(res => this.searchHints = res);
    }
  }

}
