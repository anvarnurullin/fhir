import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

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

  getPatients(entry: IAppointment['entry'][0]): Observable<IPatient> | null {
    return entry.resource.participant
      ? this.http
          .get<IPatient>(
            `https://hapi.fhir.org/baseR4/Patient/${
              entry.resource.participant.length > 1
                ? entry.resource.participant[1].actor.reference.split('/')[1]
                : ''
            }`
          )
          .pipe(
            catchError((error) => {
              console.log(error);
              return [];
            })
          )
      : null;
  }
}
