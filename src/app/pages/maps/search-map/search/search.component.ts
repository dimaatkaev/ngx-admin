import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Location } from '../entity/Location';
import { LocationService } from '../location-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  @Output() positionChanged = new EventEmitter<Location>();

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private locationService: LocationService) {
  }

  onSearch(address: string): void {
    this.locationService.searchByAddress(address)
      .map((response: any) => {
        if (response && response.results) {
          return response;
        }
        throw Error('expired token');
      })
      .map((response: any) => {
        return new Location(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);
      })
      .catch((err: HttpErrorResponse) => {
        console.log('Error', err);
        return Observable.of(null);
      })
      .subscribe((location: Location) => {
        if (location) {
          this.positionChanged.emit(location);
        }
      });
  }
}
