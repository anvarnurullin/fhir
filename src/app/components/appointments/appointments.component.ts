import { Component, Input, OnInit } from '@angular/core';
import {
  catchError,
  map,
  tap,
  mergeMap,
  Observable,
  switchMap,
  concatAll,
} from 'rxjs';
import { IAppointments } from 'src/app/models/appointments';
import { IPatients } from 'src/app/models/patients';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { HttpClient } from '@angular/common/http';
import { IPatientInfo } from 'src/app/models/patientInfo';
import { IAppointmentInfo } from 'src/app/models/appointmentInfo';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  @Input()
  entries$: Observable<IPatients['entry']>;
  appointments$: Observable<IAppointments['entry']>;
  patients: any[] = [];
  appointments: IAppointments['entry'];
  overlaps: IPatientInfo[] = [];
  patientCounts = new Map<string, number>();
  appointmentsEntries: IAppointmentInfo[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    public appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.appointments$ = this.appointmentsService.getAppointments().pipe(
      map((data) => data.entry),
      catchError((error) => {
        console.log(error);
        return [];
      }),
      tap((appointments) => {
        this.appointments = appointments;
        for (const app of this.appointments) {
          if (app.resource.participant && app.resource.participant[1]) {
            const appo: IAppointmentInfo = {
              description: app.resource.description
                ? app.resource.description
                : '',
              start: app.resource.start ? app.resource.start : '',
              participant:
                app.resource.participant && app.resource.participant[1]
                  ? app.resource.participant[1].actor!.reference.split('/')[1]
                  : '',
            };
            this.appointmentsEntries.push(appo);
          }
        }
      })
    );

    this.appointments$.pipe(
      switchMap((data) =>
        data.map((entry) => {
          return entry.resource.participant &&
            entry.resource.participant[1] &&
            entry.resource.participant[1].actor
            ? this.http.get<IPatients>(
                `https://hapi.fhir.org/baseR4/${
                  entry.resource.participant![1].actor!.reference
                }`
              )
            : ([] as unknown as Observable<IPatients['entry']>);
        })
      ),
      concatAll(),
      catchError((error) => {
        console.log(error);
        return [];
      }),
      map((patients) => {
        this.patients.push(patients);
        for (const app of this.appointments) {
          const patientId =
            app.resource.participant &&
            app.resource.participant[1] &&
            app.resource.participant[1].actor!.reference.split('/')[1];

          if (this.patientCounts.has(patientId!)) {
            this.patientCounts.set(
              patientId!,
              this.patientCounts.get(patientId!)! + 1
            );
          } else {
            this.patientCounts.set(patientId!, 1);
          }

          for (const patient of this.patients) {
            if (patientId) {
              const overlap: IPatientInfo = {
                id: patient.id,
                name: patient.name[0].text
                  ? patient.name[0].text
                  : patient.name.family + ' ' + patient.name.given,
                gender: patient.gender ? patient.gender : 'no data',
                birthDate: patient.birthDate ? patient.birthDate : 'no data',
              };

              this.overlaps.push(overlap);
              this.overlaps = this.overlaps.filter(
                (thing, index, self) =>
                  index === self.findIndex((t) => t.id === thing.id)
              );
            }
          }
        }
      }),
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
            ? this.http.get<IPatients>(
                `https://hapi.fhir.org/baseR4/${
                  entry.resource.participant![1].actor!.reference
                }`
              )
            : ([] as unknown as Observable<IPatients['entry']>);
        })
      ),
      mergeMap((data) => data as Observable<IPatients['entry']>),
      catchError((error) => {
        console.log(error);
        return [];
      })
    );

    this.entries$.subscribe({
      next: (data) => this.patients.push(data),
      error: (error) => console.log(error),
      complete: () => {
        for (const app of this.appointments) {
          const patientId =
            app.resource.participant &&
            app.resource.participant[1] &&
            app.resource.participant[1].actor!.reference.split('/')[1];
          if (this.patientCounts.has(patientId!)) {
            this.patientCounts.set(
              patientId!,
              this.patientCounts.get(patientId!)! + 1
            );
          } else {
            this.patientCounts.set(patientId!, 1);
          }
          for (const patient of this.patients) {
            if (patientId) {
              const overlap: IPatientInfo = {
                id: patient.id,
                name: patient.name[0].text
                  ? patient.name[0].text
                  : patient.name.family + ' ' + patient.name.given,
                gender: patient.gender ? patient.gender : 'no data',
                birthDate: patient.birthDate ? patient.birthDate : 'no data',
              };
              this.overlaps.push(overlap);
              this.overlaps = this.overlaps
                .filter(
                  (arr, index, self) =>
                    index === self.findIndex((t) => t.id === arr.id)
                )
                .slice(0, 10);
            }
          }
        }
        if (this.overlaps) {
          this.loading = false;
        }

        console.log(this.appointments);
        console.log(this.appointmentsEntries);
        console.log(this.overlaps);
        console.log(this.patientCounts);
      },
    });
  }
}
