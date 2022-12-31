import { Component, OnInit } from '@angular/core';
import {
  catchError,
  map,
  tap,
  Observable,
  switchMap,
  finalize,
  mergeAll,
} from 'rxjs';
import { IAppointments } from 'src/app/models/appointments';
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
  entries$: Observable<number>;
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
      tap((appointments) => {
        this.appointments = appointments;
        for (const app of this.appointments) {
          if (app.resource.participant && app.resource.participant[1]) {
            const appointment: IAppointmentInfo = {
              description: app.resource.description || '',
              start: app.resource.start || '',
              participant:
                app.resource.participant[1].actor!.reference.split('/')[1] ||
                '',
            };
            this.appointmentsEntries.push(appointment);
          }
        }
      }),
      catchError((error) => {
        console.error(error);
        return [];
      })
    );

    this.entries$ = this.appointments$.pipe(
      switchMap((data) =>
        data.map((entry) => {
          return (
            (entry.resource.participant &&
              entry.resource.participant[1] &&
              this.http.get(
                `https://hapi.fhir.org/baseR4/${
                  entry.resource.participant[1].actor!.reference
                }`
              )) ||
            []
          );
        })
      ),
      mergeAll(),
      map((data) => this.patients.push(data)),
      finalize(() => {
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
                name:
                  patient.name[0].text ||
                  patient.name.family + ' ' + patient.name.given,
                gender: patient.gender || 'no data',
                birthDate: patient.birthDate || 'no data',
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
      }),
      catchError((error) => {
        console.error(error);
        return [];
      })
    );
    this.entries$.subscribe();
  }
}
