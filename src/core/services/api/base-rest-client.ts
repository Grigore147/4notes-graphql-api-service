import { IQueryFilters } from 'src/core/types/query-filters';
import { HttpClient } from './http-client';

export abstract class BaseRestClient<Entity = any, Collection = any> {
    protected httpClient: HttpClient;

    constructor(baseUrl: string, accessToken?: string) {
        this.httpClient = new HttpClient(baseUrl, accessToken);
    }

    public async find(query?: IQueryFilters, options?: RequestInit): Promise<Collection> {
        return this.httpClient.get<Collection>('/', query, options);
    }

    public async findOneById(id: string, query?: IQueryFilters, options?: RequestInit): Promise<Entity> {
        return this.httpClient.get<Entity>(`/${id}`, query, options);
    }

    public async create(data: any, query?: IQueryFilters, options?: RequestInit): Promise<Entity> {
        return this.httpClient.post<Entity>('/', data, query, options);
    }

    public async update(id: string, data: any, query?: IQueryFilters, options?: RequestInit): Promise<Entity> {
        return this.httpClient.put<Entity>(`/${id}`, data, query, options);
    }

    public async delete(id: string, query?: IQueryFilters, options?: RequestInit): Promise<Entity> {
        return this.httpClient.delete<Entity>(`/${id}`, query, options);
    }
}
