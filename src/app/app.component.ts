import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppointment } from './models/appointments';
import { IPatient } from './models/patients';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'fhir';
  appointments$: Observable<IAppointment>;
  patients$: Observable<IPatient>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.appointments$ = this.http.get<IAppointment>(
      'https://hapi.fhir.org/baseR4/Appointment?_count=10&_format=json'
    );
    this.appointments$.subscribe((data) => {
      data.entry.forEach((entry: any) => {
        entry.resource.participant && entry.resource.participant.forEach((participant: any) => {
          this.patients$ = this.http.get<IPatient>(
            `http://hapi.fhir.org/baseR4/Patient/${participant.actor ? participant[1].actor.reference.split('/')[1] : ''}`
          );
          this.patients$.subscribe((data) => {
            return data;
          });
        });
      });
    });
  }
}
