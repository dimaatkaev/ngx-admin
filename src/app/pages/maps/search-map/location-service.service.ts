import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as geocoder from 'geocoder';

@Injectable()
export class LocationService {

  searchLocation(location: string): Observable<any> {
    return Observable.create(observer => {
      geocoder.geocode(location, (err, response) => {
        if (response) {
          observer.next(response);
        }
        if (err) {
          observer.error(err);
        }
        observer.complete();
      });
    });
  }
}
