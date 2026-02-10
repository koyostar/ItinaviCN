import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateExpenseRequestSchema,
  ExpenseIdParamSchema,
  ExpenseResponseSchema,
  ListExpensesResponseSchema,
  TripIdParamSchema,
  UpdateExpenseRequestSchema,
} from '@itinavi/schema';
import { Prisma } from '@prisma/client';
import { validate } from '../../common/validate';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Transforms a database expense record to API response format.
 * Converts Date objects to ISO strings and Decimal to number.
 *
 * @param expense - Raw expense data from database
 * @returns Validated expense response conforming to ExpenseResponseSchema
 */
function toExpenseResponse(expense: {
  id: string;
  tripId: string;
  title: string;
  category: string;
  expenseDateTime: Date;
  amountDestinationMinor: number;
  destinationCurrency: string;
  exchangeRateUsed: Prisma.Decimal | null;
  linkedItineraryItemId: string | null;
  linkedLocationId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return ExpenseResponseSchema.parse({
    id: expense.id,
    tripId: expense.tripId,
    title: expense.title,
    category: expense.category,
    expenseDateTime: expense.expenseDateTime.toISOString(),
    amountDestinationMinor: expense.amountDestinationMinor,
    destinationCurrency: expense.destinationCurrency,
    exchangeRateUsed: expense.exchangeRateUsed
      ? parseFloat(expense.exchangeRateUsed.toString())
      : undefined,
    linkedItineraryItemId: expense.linkedItineraryItemId,
    linkedLocationId: expense.linkedLocationId,
    notes: expense.notes,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  });
}

/**
 * REST controller for expense management endpoints.
 * Handles HTTP requests for CRUD operations on expenses within a trip.
 *
 * Base path: /api/trips/:tripId/expenses
 */
@Controller('api/trips/:tripId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expenses: ExpensesService) {}

  /**
   * GET /api/trips/:tripId/expenses
   * Retrieves all expenses for a specific trip sorted by expense date.
   *
   * @param params - Route parameters containing tripId
   * @returns List of expenses with their details
   */
  @Get()
  async list(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const rows = await this.expenses.listExpenses(tripId);
    const payload = { items: rows.map(toExpenseResponse) };
    return ListExpensesResponseSchema.parse(payload);
  }

  /**
   * GET /api/trips/:tripId/expenses/:expenseId
   * Retrieves a single expense by ID.
   *
   * @param params - Route parameters containing tripId and expenseId
   * @returns The expense details
   */
  @Get(':expenseId')
  async get(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const { expenseId } = validate(ExpenseIdParamSchema, params);
    const row = await this.expenses.getExpense(tripId, expenseId);
    return toExpenseResponse(row);
  }

  /**
   * POST /api/trips/:tripId/expenses
   * Creates a new expense for the trip.
   *
   * @param params - Route parameters containing tripId
   * @param body - Expense creation data
   * @returns The newly created expense
   */
  @Post()
  async create(@Param() params: unknown, @Body() body: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const input = validate(CreateExpenseRequestSchema, body);

    const row = await this.expenses.createExpense(tripId, {
      title: input.title,
      category: input.category || 'Other',
      expenseDateTime: new Date(input.expenseDateTime),
      amountDestinationMinor: input.amountDestinationMinor,
      destinationCurrency: input.destinationCurrency,
      exchangeRateUsed: input.exchangeRateUsed,
      notes: input.notes,
      linkedItineraryItem: input.linkedItineraryItemId
        ? { connect: { id: input.linkedItineraryItemId } }
        : undefined,
      linkedLocation: input.linkedLocationId
        ? { connect: { id: input.linkedLocationId } }
        : undefined,
    });

    return toExpenseResponse(row);
  }

  /**
   * PATCH /api/trips/:tripId/expenses/:expenseId
   * Updates an existing expense.
   *
   * @param params - Route parameters containing tripId and expenseId
   * @param body - Expense update data
   * @returns The updated expense
   */
  @Patch(':expenseId')
  async update(@Param() params: unknown, @Body() body: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const { expenseId } = validate(ExpenseIdParamSchema, params);
    const input = validate(UpdateExpenseRequestSchema, body);

    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.expenseDateTime !== undefined)
      updateData.expenseDateTime = new Date(input.expenseDateTime);
    if (input.amountDestinationMinor !== undefined)
      updateData.amountDestinationMinor = input.amountDestinationMinor;
    if (input.destinationCurrency !== undefined)
      updateData.destinationCurrency = input.destinationCurrency;
    if (input.exchangeRateUsed !== undefined)
      updateData.exchangeRateUsed = input.exchangeRateUsed;
    if (input.notes !== undefined) updateData.notes = input.notes;

    if (input.linkedItineraryItemId !== undefined) {
      updateData.linkedItineraryItem = input.linkedItineraryItemId
        ? { connect: { id: input.linkedItineraryItemId } }
        : { disconnect: true };
    }

    if (input.linkedLocationId !== undefined) {
      updateData.linkedLocation = input.linkedLocationId
        ? { connect: { id: input.linkedLocationId } }
        : { disconnect: true };
    }

    const row = await this.expenses.updateExpense(
      tripId,
      expenseId,
      updateData,
    );
    return toExpenseResponse(row);
  }

  /**
   * DELETE /api/trips/:tripId/expenses/:expenseId
   * Deletes an expense.
   *
   * @param params - Route parameters containing tripId and expenseId
   * @returns No content
   */
  @Delete(':expenseId')
  @HttpCode(204)
  async delete(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const { expenseId } = validate(ExpenseIdParamSchema, params);
    await this.expenses.deleteExpense(tripId, expenseId);
  }

  /**
   * POST /api/trips/:tripId/expenses/:expenseId/settle/:userId
   * Marks an expense split as settled for a specific user.
   *
   * @param params - Route parameters
   * @returns The updated expense split
   */
  @Post(':expenseId/settle/:userId')
  async settleSplit(
    @Param('expenseId') expenseId: string,
    @Param('userId') userId: string,
  ) {
    return this.expenses.settleExpenseSplit(expenseId, userId);
  }

  /**
   * GET /api/trips/:tripId/balances
   * Gets the balance summary for all users in the trip.
   *
   * @param params - Route parameters containing tripId
   * @returns Balance information showing who owes whom
   */
  @Get('../balances')
  async getTripBalances(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    return this.expenses.getTripBalances(tripId);
  }

  /**
   * GET /api/trips/:tripId/my-balance
   * Gets the balance summary for the current user.
   *
   * @param params - Route parameters containing tripId
   * @param user - The authenticated user
   * @returns Balance summary for the user
   */
  @Get('../my-balance')
  async getMyBalance(@Param() params: unknown, @CurrentUser() user: any) {
    const { tripId } = validate(TripIdParamSchema, params);
    return this.expenses.getUserBalanceSummary(tripId, user.id);
  }
}
