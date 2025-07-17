import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context).getContext<{ req: Request }>();

        if (!(ctx.req.headers['authorization'] as string) || null) {
            throw new UnauthorizedException('No auth token provided');
        }

        return true;
    }
}
