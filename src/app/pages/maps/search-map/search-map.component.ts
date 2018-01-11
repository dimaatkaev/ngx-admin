import { Component } from '@angular/core';
import { Location } from './entity/Location';

@Component({
  selector: 'ngx-search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss'],
})
export class SearchMapComponent {

  initLat = 55;
  initLng = 23;
  searchedLocation: Location = new Location(this.initLat, this.initLng);

  updateLocation(newSearchedLocation: Location) {
    this.searchedLocation = newSearchedLocation;
  }
}
