import { Component, Input, OnInit } from '@angular/core';
import { catchError, map, mergeMap, Observable, switchMap } from 'rxjs';
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
  patients: any[] = [];
  appointments: IAppointment['entry'];
  coincidences: any[] = [];

  constructor(
    private http: HttpClient,
    public appointmentsService: AppointmentsService,
    public patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

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
            : ([] as unknown);
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
        this.patients = this.patients.filter(
          (arr, index, self) => index === self.findIndex((t) => t.id === arr.id)
        );
        console.log(this.patients);
        this.coincidences = this.appointments.filter((appointment) =>
          this.patients.some(
            (patient) =>
              appointment.resource.participant &&
              appointment.resource.participant.length > 1 &&
              appointment.resource.participant[1].actor?.reference.split(
                '/'
              )[1] === patient.id
          )
        );
        console.log(this.coincidences);
      },
    });
  }
}
