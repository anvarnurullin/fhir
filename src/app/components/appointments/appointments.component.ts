import { Component, Input } from '@angular/core';
import { IAppointment } from 'src/app/models/appointments';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent {
  title = 'fhir';
  @Input() appointments: IAppointment; 
}
