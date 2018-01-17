import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '../entity/Location';
import { LocationService } from '../location-service.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() positionChanged = new EventEmitter<Location>();
  locations$: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);
  search = new FormControl();

  constructor(private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.search
      .valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .withLatestFrom(
        this.locations$,
      )
      .switchMap(([currentTerm, currentLocations]: [string, Location[]]) => {
        // check currentTerm in the currentLocations
        // if exists - fire location changed output
        // else - get locations for the term
        const chooseLocation: Location = currentLocations.find(location => {
          return location.locationName === currentTerm;
        });
        if (chooseLocation) {
          this.positionChanged.emit(chooseLocation);
          return of(currentLocations);
        } else {
          return this.locationService.getLocations(currentTerm);
        }
      })
      .subscribe(this.locations$);
  }
}
