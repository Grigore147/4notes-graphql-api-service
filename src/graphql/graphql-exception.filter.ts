import { v4 as uuidv4 } from 'uuid';

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { ValidationException } from 'src/exceptions/validation.exception';

export class GraphQLValidationError extends GraphQLError {}

export interface GraphQLContext {
    req: Request;
    res: Response;
}

type HttpHeaders = Headers & {
    'x-request-id'?: string;
    'x-correlation-id'?: string;
};

@Catch(BadRequestException)
export class GraphQLValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        if (exception instanceof ValidationException) {
            const gqlContext = GqlExecutionContext.create(host as ExecutionContext);
            const request = gqlContext.getContext<GraphQLContext>().req;
            const headers: HttpHeaders = request.headers;

            throw new GraphQLValidationError(exception.message, {
                extensions: {
                    code: 422,
                    message: exception.message,
                    meta: {
                        requestId: headers['x-request-id'] ?? uuidv4(),
                        correlationId: headers['x-correlation-id'] ?? uuidv4()
                    },
                    data: exception.validationErrors
                }
            });
        }
    }
}
