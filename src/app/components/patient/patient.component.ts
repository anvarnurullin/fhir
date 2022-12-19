// import { Component, Input, OnInit } from '@angular/core';
// import { catchError, map, mergeMap, Observable, switchMap } from 'rxjs';
// import { IPatient } from 'src/app/models/patients';
// import { AppointmentsService } from 'src/app/services/appointments.service';
// import { PatientsService } from 'src/app/services/patients.service';

// @Component({
//   selector: 'app-patient',
//   templateUrl: './patient.component.html',
//   styleUrls: ['./patient.component.css'],
// })
// export class PatientComponent implements OnInit, IPatient {
//   @Input()
//   entries$: Observable<IPatient['entry']>;

//   constructor(
//     public appointmentsService: AppointmentsService,
//     public patientsService: PatientsService
//   ) {}
//   resourceType: string;
//   id: string;
//   meta: { lastUpdated: string };
//   link: [{ relation: string; url: string }, { relation: string; url: string }];
//   entry: [
//     {
//       fullUrl: string;
//       resource: {
//         resourceType: string;
//         id: string;
//         meta: {
//           versionId: string;
//           lastUpdated: string;
//           source: string;
//         };
//         text: {
//           status: string;
//           div: string;
//         };
//         identifier: [
//           {
//             system: string;
//             value: string;
//           }
//         ];
//         name: [
//           {
//             use: string;
//             text: string;
//             family: string;
//             given: string[];
//           }
//         ];
//         gender: string;
//         birthDate: string;
//         maritalStatus: {
//           coding: [
//             {
//               system: string;
//               code: string;
//               display: string;
//             }
//           ];
//           text: string;
//         };
//       };
//       search: {
//         mode: string;
//       };
//     }
//   ];

//   ngOnInit(): void {
//     this.entries$ = this.appointmentsService.getAppointments().pipe(
//       switchMap((data) =>
//         data
//           ? data.map((entry) => {
//               return entry
//                 ? this.patientsService
//                     .getPatients(entry)
//                     ?.pipe(map((patient) => patient.entry))
//                 : null;
//             })
//           : []
//       ),
//       mergeMap((data) => (data ? (data as Observable<IPatient['entry']>) : [])),
//       catchError((error) => {
//         console.log(error);
//         return [];
//       })
//     );
//   }
// }

//                 <app-patient
//                   *ngIf="entries$ | async"
//                   [patient]="(entries$ | async)[entry.resource.id - 1]"
//                 ></app-patient>
