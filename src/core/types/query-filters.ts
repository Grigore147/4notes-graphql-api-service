import { ArgsType, Field, HideField, Int } from '@nestjs/graphql';
import { ArrayMinSize, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

export interface IQueryFilters {
    page?: number;
    limit?: number;
    offset?: number;
    sort?: Record<string, string>;
    include?: string[];
    search?: string;
    accessToken?: string;
}

@ArgsType()
export class QueryFilters implements IQueryFilters {
    @Field(() => Int, { defaultValue: 1 })
    @IsOptional()
    @Min(1)
    @Max(Number.MAX_VALUE)
    page?: number = 1;

    @Field(() => Int, { defaultValue: 25 })
    @IsOptional()
    @Min(1)
    @Max(1000)
    limit?: number = 25;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(0)
    @Max(Number.MAX_VALUE)
    offset?: number;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    sort?: Record<string, string>;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @ArrayMinSize(1)
    include?: string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Length(1, 30)
    search?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @HideField()
    accessToken?: string;
}
