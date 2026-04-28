import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlContext } from 'src/auth/guards/auth.guard';

import { DataloadersMap } from 'src/graphql/dataloader/dataloader.factory';

export function DataLoader<K extends keyof DataloadersMap>(key: K) {
    return createParamDecorator((_data: unknown, ctx: ExecutionContext): DataloadersMap[K] => {
        const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();

        return gqlCtx.dataloaders[key];
    })();
}
