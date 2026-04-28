import { HttpStatus } from '@nestjs/common';

import { GraphQLValidationError } from 'src/graphql/graphql-exception.filter';
import { ApiErrorResponse } from './api-error';
import { QueryFilters, type IQueryFilters } from 'src/core/types/query-filters';

export class HttpClient {
    protected baseUrl: string;
    protected accessToken?: string;
    protected defaultHeaders: Record<string, string>;

    constructor(baseUrl: string, accessToken?: string) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.accessToken = accessToken;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
    }

    protected async request<T>(
        method: string,
        endpoint: string,
        query: IQueryFilters = {},
        options: RequestInit = {}
    ): Promise<T> {
        const config: RequestInit & {
            headers: HeadersInit;
        } = {
            ...options,
            method: method,
            headers: {
                ...this.defaultHeaders,
                ...(options.headers || {})
            }
        };

        if (query.accessToken || this.accessToken) {
            config.headers['Authorization'] = `Bearer ${query.accessToken ?? this.accessToken}`;

            delete query.accessToken;
        }

        const url = `${this.baseUrl}${endpoint}${this.buildQueryString(query)}`;

        const response = await fetch(url, config);

        // TODO: Implement proper API error handling for different error types
        if (!response.ok) {
            const extensions: Record<string, any> = {
                code: response.status,
                message: response.statusText
            };

            if (response.status === HttpStatus.UNPROCESSABLE_ENTITY.valueOf()) {
                const { code, message, meta, errors } = (await response.json()) as ApiErrorResponse;

                extensions.code = code;
                extensions.message = message;
                extensions.meta = meta;
                extensions.data = errors;
            }

            throw new GraphQLValidationError(response.statusText, { extensions });
        }

        return response.json() as Promise<T>;
    }

    public async get<T>(endpoint: string, query?: QueryFilters, options?: RequestInit): Promise<T> {
        return this.request<T>('GET', endpoint, query, options);
    }

    public async post<T>(endpoint: string, data?: any, query?: QueryFilters, options?: RequestInit): Promise<T> {
        return this.request<T>('POST', endpoint, query, {
            ...options,
            body: JSON.stringify(data)
        });
    }

    public async put<T>(endpoint: string, data?: any, query?: QueryFilters, options?: RequestInit): Promise<T> {
        return this.request<T>('PUT', endpoint, query, {
            ...options,
            body: JSON.stringify(data)
        });
    }

    public async delete<T>(endpoint: string, query?: QueryFilters, options?: RequestInit): Promise<T> {
        return this.request<T>('DELETE', endpoint, query, options);
    }

    public buildQueryString(options: QueryFilters = {}): string {
        const reservedKeys = ['page', 'limit', 'offset', 'sort', 'include', 'search', 'accessToken'];
        const params = new URLSearchParams();

        if (options.page !== undefined) params.append('page', options.page.toString());
        if (options.limit !== undefined) params.append('limit', options.limit.toString());
        if (options.offset !== undefined) params.append('offset', options.offset.toString());
        if (options.sort !== undefined) {
            Object.entries(options.sort).forEach(([key, value]) => {
                params.append(`sort[${key}]`, value);
            });
        }
        if (options.include !== undefined) params.append('include', options.include.join(','));
        if (options.search !== undefined) params.append('search', options.search);

        Object.entries(options).forEach(([key, value]) => {
            if (!reservedKeys.includes(key)) {
                if (Array.isArray(value)) {
                    value.forEach((v) => params.append(`${key}[]`, v as string));
                } else if (value !== undefined) {
                    params.append(key, value as string);
                }
            }
        });

        const queryString = params.toString();

        return queryString ? `?${queryString}` : '';
    }

    public setAccessToken(token: string): HttpClient {
        this.accessToken = token;

        return this;
    }

    public clearAccessToken(): HttpClient {
        this.accessToken = undefined;

        return this;
    }
}
