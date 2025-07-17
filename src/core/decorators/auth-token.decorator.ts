import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from 'src/app.module';

export const AuthToken = createParamDecorator((data: unknown, context: ExecutionContext): string | undefined => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().authToken;
});
