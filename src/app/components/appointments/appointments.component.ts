import { Component, Input, OnInit } from '@angular/core';
import {
  catchError,
  distinct,
  filter,
  map,
  mergeMap,
  Observable,
  switchMap,
} from 'rxjs';
import { IAppointment } from 'src/app/models/appointments';
import { IPatient } from 'src/app/models/patients';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { PatientsService } from 'src/app/services/patients.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  @Input()
  entries$: Observable<IPatient['entry']>;
  appointments$: Observable<IAppointment['entry']>;
  loading = false;
  patients: any = [];

  constructor(
    private http: HttpClient,
    public appointmentsService: AppointmentsService,
    public patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // this.entries$ = this.appointmentsService.getAppointments().pipe(
    //   switchMap((data) =>
    //     data
    //       ? data.entry.map((entry) => {
    //           return entry
    //             ? this.patientsService.getPatients(entry)?.pipe(
    //                 map((patient) => patient.entry),
    //                 map((entry) => entry?.slice(0, 10))
    //               )
    //             : null;
    //         })
    //       : []
    //   ),
    //   mergeMap((data) => (data ? (data as Observable<IPatient['entry']>) : [])),
    //   catchError((error) => {
    //     console.log(error);
    //     return [];
    //   })
    // );

    this.appointments$ = this.appointmentsService.getAppointments().pipe(
      map((data) => data.entry),
      catchError((error) => {
        console.log(error);
        return [];
      })
    );

    this.entries$ = this.appointments$.pipe(
      switchMap((data) =>
        data.map((entry) => {
          return entry.resource.participant &&
            entry.resource.participant[1] &&
            entry.resource.participant[1].actor
            ? this.http.get<IPatient>(
                `https://hapi.fhir.org/baseR4/${
                  entry.resource.participant![1].actor!.reference
                }`
              )
            : ([] as unknown as Observable<IPatient['entry']>);
        })
      ),
      mergeMap((data) => data as Observable<IPatient['entry']>),
      catchError((error) => {
        console.log(error);
        return [];
      })
    );

    this.entries$.subscribe((data) => console.log(data));
    this.appointments$.subscribe((data) => console.log(data));

    if (this.appointments$ && this.entries$) {
      this.loading = false;
    }
  }
}
