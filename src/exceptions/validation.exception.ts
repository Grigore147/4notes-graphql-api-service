import { BadRequestException, ValidationError } from '@nestjs/common';

export const ValidationExceptionFactory = (errors: ValidationError[]) => {
    const formatError = (errors: ValidationError[]) => {
        const formattedError = {};

        errors.forEach((error: ValidationError) => {
            formattedError[error.property] = error.children?.length
                ? [formatError(error.children)]
                : [...Object.values(error.constraints || {})];
        });

        return formattedError;
    };

    return new ValidationException(formatError(errors));
};

export class ValidationException extends BadRequestException {
    constructor(public validationErrors: Record<string, unknown>) {
        super(validationErrors);
    }
}
