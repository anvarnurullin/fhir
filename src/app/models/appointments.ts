export interface IAppointment {
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
        text: {
          status: string;
          div: string;
        };
        status: string;
        description: string;
        start: string;
        end: string;
        minutesDuration: number;
        participant: [
          {
            actor: {
              display: string;
            };
            status: string;
          },
          {
            actor: {
              reference: string;
            };
            status: string;
          }
        ];
      };
      search: {
        mode: string;
      };
    }
  ];
}
