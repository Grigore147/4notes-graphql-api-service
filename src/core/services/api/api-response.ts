import { HttpStatus } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface IApiResponse<T = any> {
    status: 'success' | 'error';
    code: number;
    message: string;
    meta: Meta;
    data: T;
}

export interface IApiErrorResponse {
    status: 'error';
    code: number;
    message: string;
    meta: Meta;
    errors: any;
}

export interface IApiPaginatedResponse<T> extends IApiResponse<T[]> {
    meta: PaginationMeta;
}

@ObjectType()
export class Meta {
    @Field()
    requestId: string;

    @Field()
    correlationId: string;

    @Field()
    type: string;
}

@ObjectType()
export class Pagination {
    @Field()
    from: number;

    @Field()
    to: number;

    @Field()
    total: number;

    @Field()
    perPage: number;

    @Field()
    currentPage: number;

    @Field()
    lastPage: number;
}

@ObjectType()
export class PaginationMeta extends Meta {
    @Field(() => Pagination)
    pagination: Pagination;
}

@ObjectType({ isAbstract: true })
export abstract class Resource<T> implements IApiResponse<T> {
    @Field()
    status: 'success' | 'error' = 'success';

    @Field()
    code: number = 200;

    @Field()
    message: string = '';

    @Field(() => Meta)
    meta: Meta;

    data: T;

    constructor(partial: Partial<Resource<T>>) {
        Object.assign(this, partial);
    }

    static created<T, R extends Resource<T>>(this: new (...args: any[]) => R, ...args: any[]): R {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const resource = new this(...args);

        resource.code = HttpStatus.CREATED;

        return resource;
    }
}

@ObjectType()
export class ResourceCollection<T> implements IApiPaginatedResponse<T> {
    @Field()
    status: 'success' | 'error';

    @Field()
    code: number;

    @Field()
    message: string;

    @Field(() => PaginationMeta)
    meta: PaginationMeta;

    data: T[];

    constructor(partial: Partial<ResourceCollection<T>>) {
        Object.assign(this, partial);
    }
}
