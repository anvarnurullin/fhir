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
                status: string;
                participant: [
                    {
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

