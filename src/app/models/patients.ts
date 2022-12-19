export interface IPatient {
  resourceType: string;
  id: string;
  meta: {
    lastUpdated: string;
  };
  link: [
    {
      relation: string;
      url: string;
    },
    {
      relation: string;
      url: string;
    }
  ];
  entry: [
    {
      fullUrl: string;
      resource: {
        resourceType: string;
        id: string;
        meta: {
          versionId: string;
          lastUpdated: string;
          source: string;
        };
        text: {
          status: string;
          div: string;
        };
        identifier: [
          {
            system: string;
            value: string;
          }
        ];
        name: [
          {
            use: string;
            text: string;
            family: string;
            given: string[];
          }
        ];
        gender: string;
        birthDate: string;
        maritalStatus: {
          coding: [
            {
              system: string;
              code: string;
              display: string;
            }
          ];
          text: string;
        };
      };
      search: {
        mode: string;
      };
    }
  ];
}


// export interface IPatient {
//   resourceType: string;
//   id: string;
//   meta: {
//     versionId: string;
//     lastUpdated: string;
//     source: string;
//   };
//   text: {
//     status: string;
//     div: string;
//   };
//   name: [
//     {
//       use?: string;
//       text: string;
//       family?: string;
//       given?: string[];
//     }
//   ];
//   gender?: string;
//   birthDate?: string;
//   managingOrganization?: {
//     reference: string;
//     display: string;
//   };
//   maritalStatus?: {
//     coding: [
//       {
//         system: string;
//         code: string;
//         display: string;
//       }
//     ];
//     text: string;
//   };
// }