import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ValidationExceptionFactory } from './exceptions/validation.exception';
import { GraphQLValidationExceptionFilter } from './graphql/graphql-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get<ConfigService>(ConfigService);
    const appPort = config.get<number>('app.port', 3000);

    app.useGlobalFilters(new GraphQLValidationExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            disableErrorMessages: false,
            exceptionFactory: ValidationExceptionFactory,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transformOptions: {
                exposeUnsetFields: false,
                enableImplicitConversion: true
            }
        })
    );

    await app.listen(appPort);

    console.log(`🚀 4Notes GraphQL API running on port ${appPort}`);
    console.log(`📊 GraphQL Playground available at http://localhost:${appPort}/graphql`);
}

void bootstrap();
