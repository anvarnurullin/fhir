import { Component, Input, OnInit } from '@angular/core';
import { map, mergeMap, Observable, switchMap } from 'rxjs';
import { IPatient } from 'src/app/models/patients';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { PatientsService } from 'src/app/services/patients.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  @Input()
  entries$: Observable<IPatient['entry']>;
  loading = false;

  constructor(
    public appointmentsService: AppointmentsService,
    public patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.entries$ = this.appointmentsService.getAppointments().pipe(
      switchMap((data) =>
        data
          ? data.map((entry) => {
              return entry
                ? this.patientsService
                    .getPatients(entry)
                    ?.pipe(map((patient) => patient.entry))
                : null;
            })
          : []
      ),
      mergeMap((data) => (data ? (data as Observable<IPatient['entry']>) : []))
    );
    if (this.entries$) {
      this.loading = false;
    }
  }
}
