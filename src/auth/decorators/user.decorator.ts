import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { UserInterface } from 'src/auth/interfaces/user.entity';
import type { GqlContext } from '../guards/auth.guard';

export const User = createParamDecorator((data: unknown, context: ExecutionContext): UserInterface | undefined => {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().user;
});
