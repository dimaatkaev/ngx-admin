import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocationService {

  private key = 'AIzaSyDU7nlRcJTW0VhnfCMkLytn4lhtvaXtF3w';

  constructor(private http: Http) {
  }

  searchByAddress(location: string): Observable<any> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    return this.http.get(url, {
      params: {
        address: location,
        key: this.key,
      },
    }).map((result: Response) => result.json());
  }
}
