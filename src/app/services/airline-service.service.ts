import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirlineServiceService {
  constructor(private _http: HttpClient) {}

  fetchAirline(page: number = 1): Observable<any> {
    return this._http.get(`https://api.instantwebtools.net/v1/passenger?page=${page}&size=10`);
  }
}
