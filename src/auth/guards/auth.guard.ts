import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
    type CanActivate,
    type ExecutionContext
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { DataloadersMap } from 'src/graphql/dataloader/dataloader.factory';
import { AuthService } from '../auth.service';
import type { AuthServiceInterface } from '../interfaces/auth.service';
import type { UserInterface } from '../interfaces/user.entity';

export interface GqlContext {
    req: Request & {
        user?: any;
    };
    res: Response;
    accessToken?: string;
    user?: UserInterface;
    dataloaders: DataloadersMap;
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthServiceInterface
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const context = GqlExecutionContext.create(ctx).getContext<GqlContext>();

        const authHeader = (context.req.headers['authorization'] as string) || '';

        context.accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

        if (context.accessToken) {
            const user = await this.authService.getUserByToken(context.accessToken);

            if (user) {
                context.user = user;

                return true;
            }
        }

        throw new UnauthorizedException('Unauthorized access');
    }
}
