import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IPatientsEntry } from 'src/app/models/patientsEntry';
import { IPatient } from 'src/app/models/patients';
import { AppointmentsService } from 'src/app/services/appointments.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  @Input()
  entries: IPatientsEntry[] = [];
  loading = false;

  constructor(
    private http: HttpClient,
    public appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.appointmentsService.getAppointments().subscribe((data) => {
      data.entry.map((entry) => {
        this.http
          .get<IPatient>(
            `https://hapi.fhir.org/baseR4/Patient/${
              entry.resource.participant.length > 1
                ? entry.resource.participant[1].actor.reference.split('/')[1]
                : ''
            }`
          )
          .subscribe((patient) => {
            this.entries = patient.entry;
          });
      });
      this.loading = false;
    });
  }
}
