import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLFormattedError } from 'graphql';

import { createDataLoaders } from './graphql/dataloader/dataloader.factory';

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

import { Space } from './notes/entities/space.entity';
import { Stack } from './notes/entities/stack.entity';
import { Notebook } from './notes/entities/notebook.entity';
import { Note } from './notes/entities/note.entity';

import config from './config';
import { AuthModule } from './auth/auth.module';
import type { GqlContext } from './auth/guards/auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        CacheModule.register({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
                // type: configService.get<DatabaseType>('db.type', 'postgres'),
                type: 'postgres',
                host: config.get<string>('db.host', 'localhost'),
                port: config.get<number>('db.port', 5432),
                username: config.get<string>('db.user', 'root'),
                password: config.get<string>('db.pass', 'root'),
                database: config.get<string>('db.name', 'test'),
                entities: [__dirname + '/entities/*{.ts,.js}'],
                autoLoadEntities: true,
                synchronize: false
            })
        }),
        TypeOrmModule.forFeature([Space, Stack, Notebook, Note]),
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
                    const dataloaders = createDataLoaders({ spaceService, stackService, notebookService, noteService });

                    return { req, res, dataloaders };
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
        }),
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService, SpacesResolver, StacksResolver, NotebooksResolver, NotesResolver]
})
export class AppModule {}
