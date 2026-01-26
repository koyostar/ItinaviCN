import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { BadRequestException } from '@nestjs/common';

/**
 * Validates input data against a Zod schema.
 * 
 * Provides standardized validation error handling for all API endpoints.
 * Transforms Zod validation errors into NestJS BadRequestException with
 * structured error messages.
 * 
 * @template T - The expected output type after validation
 * @param {ZodSchema<T>} schema - The Zod schema to validate against
 * @param {unknown} input - The input data to validate
 * @returns {T} The validated and typed data
 * @throws {BadRequestException} If validation fails, with detailed error information
 * 
 * @example
 * ```typescript
 * const tripData = validate(CreateTripRequestSchema, req.body);
 * // tripData is now typed and validated
 * ```
 */
export function validate<T>(schema: ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (e) {
    if (e instanceof ZodError) {
      throw new BadRequestException({
        message: 'Validation failed',
        issues: e.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    }
    throw e;
  }
}
