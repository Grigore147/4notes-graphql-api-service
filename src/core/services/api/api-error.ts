export type ApiErrorResponse = {
    status: string;
    code: number;
    message: string;
    meta: Record<string, string>;
    errors?: Record<string, string[]>;
};

export class ApiError extends Error {
    constructor(
        public code: number,
        public message: string,
        public meta: {
            requestId?: string;
            correlationId?: string;
        },
        public errors?: Record<string, string[]>
    ) {
        super(message);

        this.name = 'ApiError';
    }
}
