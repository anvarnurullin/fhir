import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, retry, tap } from 'rxjs';
import { IAppointment } from '../models/appointments';
import { IPatient } from '../models/patients';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}

  appointments: IAppointment;

  getAppointments(): Observable<IAppointment> {
    return this.http.get<IAppointment>(
      'https://hapi.fhir.org/baseR4/Appointment?_count=10&_format=json'
    );
  }
}
