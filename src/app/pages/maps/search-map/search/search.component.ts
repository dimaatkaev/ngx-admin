import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '../entity/Location';
import { LocationService } from '../location-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() positionChanged = new EventEmitter<Location>();
  locations$: Observable<Location[]>;
  searchTerms = new Subject<string>();

  constructor(private locationService: LocationService) {
  }

  keyUp(term: string): void {
    this.searchTerms.next(term);
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
    this.locations$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        return this.locationService.getLocations(term);
      }),
    );
  }
}
