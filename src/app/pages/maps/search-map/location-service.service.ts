import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Location } from './entity/Location';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LocationService {

  private key = 'AIzaSyDU7nlRcJTW0VhnfCMkLytn4lhtvaXtF3w';
  private url = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {
  }

  searchByAddress(location: string): Observable<any> {
    return this.http.get(this.url, {
        params: new HttpParams()
          .set('address', location)
          .set('key', this.key),
      },
    );
  }

  getLocations(term: string): Observable<Location[]> {
    if (!term.trim()) {
      // if not search term, return empty array.
      return of([]);
    }

    return this.http.get(this.url, {
        params: new HttpParams()
          .set('address', term)
          .set('key', this.key),
      })
      .map((response: any) => {
        if (response && response.results) {
          return response;
        }
        throw Error('expired token');
      })
      .map((response: any) => {
        const currVars: Location[] = [];
        for (let i = 0; i < response.results.length; i++) {
          currVars.push(new Location(response.results[i].geometry.location.lat,
            response.results[i].geometry.location.lng,
            response.results[i].formatted_address));
        }
        return currVars;
      })
      .catch((err: HttpErrorResponse) => {
        return Observable.of(null);
      });
  }
}
