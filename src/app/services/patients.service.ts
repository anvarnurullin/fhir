import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, from, Observable } from 'rxjs';

import { IPatient } from '../models/patients';
import { AppointmentsService } from './appointments.service';
import { IAppointment } from '../models/appointments';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(
    private http: HttpClient,
    public appointmentsService: AppointmentsService
  ) {}

  getPatients(entry: IAppointment['entry'][0]): Observable<IPatient> {
    return entry.resource.participant && entry.resource.participant[1]
      ? this.http
          .get<IPatient>(
            `https://hapi.fhir.org/baseR4/${
              entry.resource.participant[1].actor!.reference
            }`
          )
          .pipe(
            catchError((error) => {
              console.log(error);
              return [];
            })
          )
      : ({} as Observable<IPatient>);
  }
}
