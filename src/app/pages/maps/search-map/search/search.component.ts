import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '../entity/Location';
import { LocationService } from '../location-service.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
      .map(([currentTerm, currentLocations]: [string, Location[]]) => {
        console.log('currentTerm: ', currentTerm, 'currentLocations: ', currentLocations);
        // check currentTerm in the currentLocations
        // if exists - fire location changed output
        // else - get locations for the term
        for (const location of currentLocations) {
          if (location.locationName === currentTerm) {
            this.positionChanged.emit(location);
            return;
          }
        }
        this.locationService.getLocations(currentTerm, this.locations$);
      }).subscribe();
  }
}
