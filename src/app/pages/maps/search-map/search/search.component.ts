import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '../entity/Location';
import { LocationService } from '../location-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() positionChanged = new EventEmitter<Location>();
  locations$: Observable<Location[]>;
  search = new FormControl();

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
        return Observable.of(null);
      })
      .subscribe((location: Location) => {
        if (location) {
          this.positionChanged.emit(location);
        }
      });
  }

  ngOnInit(): void {
    this.locations$ = this.search
      .valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((term: string) => {
        return this.locationService.getLocations(term);
      });
  }
}
