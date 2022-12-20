export interface IAppointmentPatient {
  id: string;
  name: [
    {
      text: string;
      family: string;
      given: string[];
    }
  ];
  gender: string;
  birthDate: string;
}
