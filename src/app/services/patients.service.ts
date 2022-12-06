import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { IPatient } from "../models/patients";
import { AppointmentsService } from "./appointments.service";
import { IAppointmentsEntry } from "../models/appointmentsEntry";

@Injectable({
    providedIn
: "root"
})
export class PatientsService {
    constructor(private http: HttpClient, public appointmentsService: AppointmentsService) {}

    getPatients(entry: IAppointmentsEntry): Observable<IPatient> {
    return this.http
          .get<IPatient>(
            `https://hapi.fhir.org/baseR4/Patient/${
              entry.resource.participant.length > 1
                ? entry.resource.participant[1].actor.reference.split('/')[1]
                : ''
            }`
            );
    }
}