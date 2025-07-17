import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLFormattedError } from 'graphql';

import { createDataLoaders, DataloadersMap } from './graphql/dataloader/dataloader.factory';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SpacesResolver } from './graphql/resolvers/spaces.resolver';
import { StacksResolver } from './graphql/resolvers/stacks.resolver';
import { NotebooksResolver } from './graphql/resolvers/notebooks.resolver';
import { NotesResolver } from './graphql/resolvers/notes.resolver';

import { ServicesModule } from './services/services.module';
import { NoteService } from './services/note.service';
import { NotebookService } from './services/notebook.service';
import { StackService } from './services/stack.service';
import { SpaceService } from './services/space.service';

import config from './config';

export interface GqlContext {
    req: Request & {
        user?: any;
    };
    res: Response;
    authToken?: string;
    dataloaders: DataloadersMap;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config]
        }),
        ServicesModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: (
                spaceService: SpaceService,
                stackService: StackService,
                notebookService: NotebookService,
                noteService: NoteService
            ) => ({
                graphiql: true,
                debug: false,
                playground: false,
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                context: ({ req, res }: GqlContext) => {
                    const authHeader = (req.headers['authorization'] as string) || '';
                    const authToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

                    const dataloaders = createDataLoaders({ spaceService, stackService, notebookService, noteService });

                    return { req, res, authToken, dataloaders };
                },
                formatError: (formattedError: GraphQLFormattedError): any => {
                    return {
                        code: formattedError.extensions?.code ?? 500,
                        message: formattedError.message,
                        meta: formattedError.extensions?.meta ?? {},
                        errors: formattedError.extensions?.data ?? {}
                    };
                }
            }),
            inject: [SpaceService, StackService, NotebookService, NoteService]
        })
    ],
    controllers: [AppController],
    providers: [AppService, SpacesResolver, StacksResolver, NotebooksResolver, NotesResolver]
})
export class AppModule {}
