export interface IAppointments {
  resourceType: string;
  id: string;
  meta: {
    lastUpdated: string;
  };
  type: string;
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
        status: string;
        text?: {
          status: string;
          div: string;
        };
        serviceType?: [
          {
            coding: [
              {
                system: string;
                code: string;
                display: string;
              }
            ];
            text: string;
          }
        ];
        appointmentType?: {
          coding: [
            {
              system: string;
              code: string;
              display: string;
            }
          ];
        };
        description?: string;
        start?: string;
        end?: string;
        minutesDuration?: number;
        participant?: [
          {
            type?: [
              {
                coding: [
                  {
                    system: string;
                    code: string;
                  }
                ];
              }
            ];
            actor?: {
              display: string;
              reference?: string;
            };
            status: string;
          },
          {
            actor?: {
              reference: string;
            };
            status?: string;
          }
        ];
      };
      search: {
        mode: string;
      };
    }
  ];
}
