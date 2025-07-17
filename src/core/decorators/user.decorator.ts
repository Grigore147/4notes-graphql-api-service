import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type GqlContext = {
    req: Request;
    res: Response;
    authToken?: string;
};

interface UserContract {
    id: string;
    authToken?: string;
}

export class UserClass implements UserContract {
    id: string;
    authToken?: string;

    constructor(data) {
        Object.assign(this, data);
    }
}

export const User = createParamDecorator((data: unknown, context: ExecutionContext): UserClass | undefined => {
    const ctx = GqlExecutionContext.create(context);

    const authToken = ctx.getContext<GqlContext>().authToken;

    // const user = userService.getUserByToken(authToken);

    return new UserClass({
        id: 'user-123',
        authToken: authToken
    });
});
