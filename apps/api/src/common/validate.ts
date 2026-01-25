import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { BadRequestException } from '@nestjs/common';

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
