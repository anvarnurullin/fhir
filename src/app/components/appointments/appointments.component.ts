import { Component, Input, OnInit } from '@angular/core';
import { catchError, map, mergeMap, Observable, switchMap } from 'rxjs';
import { IAppointment } from 'src/app/models/appointments';
import { IPatient } from 'src/app/models/patients';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { HttpClient } from '@angular/common/http';
import { IAppointmentPatient } from 'src/app/models/appointmentPatient';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  @Input()
  entries$: Observable<IPatient['entry']>;
  appointments$: Observable<IAppointment['entry']>;
  patients: any[] = [];
  appointments: IAppointment['entry'];
  overlaps: IAppointmentPatient[] = [];
  patientCounts = new Map<string, number>();

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

    this.appointments$.subscribe({
      next: (data) => (this.appointments = data),
      error: (error) => console.log(error),
      complete: () => console.log(this.appointments),
    });

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
              const overlap: IAppointmentPatient = {
                id: patient.id,
                name: patient.name[0].text
                  ? patient.name[0].text
                  : patient.name.family + ' ' + patient.name.given,
                gender: patient.gender ? patient.gender : 'no data',
                birthDate: patient.birthDate ? patient.birthDate : 'no data',
              };
              this.overlaps.push(overlap);
              this.overlaps = this.overlaps.filter(
                (arr, index, self) =>
                  index === self.findIndex((t) => t.id === arr.id)
              );
            }
          }
        }
        console.log(this.overlaps);
        console.log(this.patientCounts);
      },
    });
  }
}
