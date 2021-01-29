import { Component, OnInit, Input } from '@angular/core';
import {Map, Control, DomUtil, ControlPosition, LatLng, DomEvent} from 'leaflet';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public custom: Control;
  public searchResult: Control;
  @Input() position: ControlPosition;
  public searchOpen: Boolean;
  public inputSearch: string;

  constructor() { 
    this.searchOpen = false;
    this.inputSearch = '';
  }

  ngOnInit(): void {
  }

  @Input() set map(map: Map){
    if (map){
      let Custom2 = Control.extend({
        onAdd(map: Map) {
          let container = DomUtil.get('search-component');
          // let inputSearch = DomUtil.get('inputSearch');
          // DomEvent.addListener(inputSearch, 'click', (e) => {
          //   DomEvent.stopPropagation(e);
          //   inputSearch.focus();            
          // });
          return container;
        },
        onRemove(map: Map) {}
      });
      this.custom=new Custom2({
          position: this.position
        }).addTo(map);

// let SearchResult = Control.extend({
//   onAdd(map: Map) {
//     let container = DomUtil.get('search-result');
//     return container;
//   },
//   onRemove(map: Map) {}
// });

// this.searchResult=new SearchResult({
//   position: this.position
// }).addTo(map);
    
    }
  }

  goSearch(){
    this.searchOpen = true;
    console.log(this.inputSearch);
  }
  closeSearch(){
    this.searchOpen = false;
    this.inputSearch = '';
  }

}
