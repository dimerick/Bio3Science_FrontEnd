import { Component, OnInit, Input } from '@angular/core';
import {Map, Control, DomUtil, ControlPosition, LatLng} from 'leaflet';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'], 
  providers: [PlacesService]
})
export class BusquedaComponent implements OnInit {
  public custom: Control;
  @Input() position: ControlPosition;

  searchForm = new FormGroup({
    inputSearch : new FormControl('Universidad de temple', [Validators.required])
  });

  constructor(
    private _placesService: PlacesService
  ) { }

  ngOnInit(): void {
  }

  @Input() set map(map: Map){
    if (map){
      let Custom = Control.extend({
        onAdd(map: Map) {
          return DomUtil.get('panel');
        },
        onRemove(map: Map) {}
      });
      this.custom=new Custom({
          position: this.position
        }).addTo(map);
    
    }
  }

  onSubmit(){
    let inputSearch = this.searchForm.value.inputSearch;
    console.log(inputSearch);
    
    
    this._placesService.getPlaces(inputSearch).subscribe(places => {
      console.log(places)
    });
  }

}
