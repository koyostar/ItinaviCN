import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service responsible for managing expense-related business logic.
 * Handles CRUD operations for expenses using Prisma ORM.
 */
@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all expenses for a specific trip, ordered by expense date.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} List of all expenses for the trip sorted chronologically
   */
  async listExpenses(tripId: string) {
    return this.prisma.expense.findMany({
      where: { tripId },
      orderBy: { expenseDateTime: 'asc' },
    });
  }

  /**
   * Retrieves a single expense by ID.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {string} expenseId - The unique identifier of the expense
   * @returns {Promise} The expense data
   * @throws {NotFoundException} If expense with given ID is not found or doesn't belong to the trip
   */
  async getExpense(tripId: string, expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  /**
   * Creates a new expense for a trip.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {Omit<Prisma.ExpenseCreateInput, 'trip'>} input - Expense creation data
   * @returns {Promise} The newly created expense
   */
  async createExpense(
    tripId: string,
    input: Omit<Prisma.ExpenseCreateInput, 'trip'>,
  ) {
    return this.prisma.expense.create({
      data: {
        ...input,
        trip: { connect: { id: tripId } },
      },
    });
  }

  /**
   * Updates an existing expense.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {string} expenseId - The unique identifier of the expense to update
   * @param {Prisma.ExpenseUpdateInput} input - Expense update data
   * @returns {Promise} The updated expense
   * @throws {NotFoundException} If expense with given ID is not found
   */
  async updateExpense(
    tripId: string,
    expenseId: string,
    input: Prisma.ExpenseUpdateInput,
  ) {
    await this.getExpense(tripId, expenseId);
    return this.prisma.expense.update({
      where: { id: expenseId },
      data: input,
    });
  }

  /**
   * Deletes an expense by ID.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {string} expenseId - The unique identifier of the expense to delete
   * @returns {Promise<void>}
   * @throws {NotFoundException} If expense with given ID is not found
   */
  async deleteExpense(tripId: string, expenseId: string) {
    await this.getExpense(tripId, expenseId);
    await this.prisma.expense.delete({ where: { id: expenseId } });
  }
}
