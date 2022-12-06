import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IPatientsEntry } from 'src/app/models/patientsEntry';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { PatientsService } from 'src/app/services/patients.service';

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
    public appointmentsService: AppointmentsService,
    public patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.appointmentsService.getAppointments().subscribe((data) => {
      data.entry.map((entry) => {
        this.patientsService.getPatients(entry).subscribe((patient) => {
          this.entries = patient.entry;
        });
      });
      this.loading = false;
    });
  }
}
