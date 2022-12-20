export interface IPatient {
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
