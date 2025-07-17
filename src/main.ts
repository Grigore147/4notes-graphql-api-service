import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ValidationExceptionFactory } from './exceptions/validation.exception';
import { GraphQLValidationExceptionFilter } from './graphql/graphql-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    await app.listen(process.env.PORT ?? 3000);

    console.log(`🚀 4Notes GraphQL API running on port 3000`);
    console.log(`📊 GraphQL Playground available at http://localhost:3000/graphql`);
}

void bootstrap();
