import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { IAppointments } from '../models/appointments';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}

  getAppointments(): Observable<IAppointments> {
    return this.http
      .get<IAppointments>('https://hapi.fhir.org/baseR4/Appointment?_count=10')
      .pipe(
        catchError((error) => {
          console.error(error);
          return [];
        })
      );
  }
}
