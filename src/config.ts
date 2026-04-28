export type Configuration = { [key: string]: any } & {
    app: {
        name: string;
        env: string;
        debug: boolean;
        timezone: string;
        url: string;
        port: number;
    };
    auth: {
        api: {
            url: string;
        };
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

    db: {
        type: process.env.DB_TYPE ?? 'postgres',
        host: process.env.DB_HOST ?? '127.0.0.1',
        port: process.env.DB_PORT ?? 5432,
        user: process.env.DB_USER ?? 'root',
        pass: process.env.DB_PASS ?? 'root',
        name: process.env.DB_NAME ?? 'test',
        entities: [],
        synchronize: false
    },

    auth: {
        api: {
            url: process.env.AUTH_API_URL ?? 'https://auth.4notes.app/api'
        }
    },
    notes: {
        api: {
            url: process.env.NOTES_API_URL ?? 'https://4notes.app/api'
        }
    }
});
