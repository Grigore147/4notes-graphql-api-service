export type Configuration = {
    app: {
        name: string;
        env: string;
        debug: boolean;
        timezone: string;
        url: string;
        port: number;
    };
    notes: {
        api: {
            url: string;
        };
    };
};

export default (): Configuration => ({
    app: {
        name: process.env.APP_NAME ?? '4notes-graphql-api-service',
        env: process.env.APP_ENV ?? 'local',
        debug: process.env.APP_DEBUG === 'true',
        timezone: process.env.APP_TIMEZONE ?? 'UTC',
        url: process.env.APP_URL ?? 'https://graphql.4notes.app',
        port: parseInt(process.env.APP_PORT ?? '3000')
    },

    notes: {
        api: {
            url: process.env.NOTES_API_URL ?? 'https://4notes.app/api'
        }
    }
});
