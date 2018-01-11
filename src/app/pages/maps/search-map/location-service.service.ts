import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class LocationService {

  private key = 'AIzaSyDU7nlRcJTW0VhnfCMkLytn4lhtvaXtF3w';

  constructor(private http: HttpClient) {
  }

  searchByAddress(location: string): Observable<any> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    return this.http.get(url, {
        params: new HttpParams()
          .set('address', location)
          .set('key', this.key),
      },
    );
  }
}
