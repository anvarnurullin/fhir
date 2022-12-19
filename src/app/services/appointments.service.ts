import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable } from 'rxjs';
import { IAppointment } from '../models/appointments';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}

  getAppointments(): Observable<IAppointment> {
    return this.http
      .get<IAppointment>('https://hapi.fhir.org/baseR4/Appointment?_count=10')
      .pipe(
        catchError((error) => {
          console.log(error);
          return [];
        })
      );
  }
}
