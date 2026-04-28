import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlContext } from '../guards/auth.guard';

export const AccessToken = createParamDecorator((data: unknown, context: ExecutionContext): string | undefined => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().accessToken;
});
