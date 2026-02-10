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
   * Includes splits and payer information.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} List of all expenses for the trip sorted chronologically
   */
  async listExpenses(tripId: string) {
    return this.prisma.expense.findMany({
      where: { tripId },
      orderBy: { expenseDateTime: 'asc' },
      include: {
        paidByUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        images: true,
      },
    });
  }

  /**
   * Retrieves a single expense by ID.
   * Includes splits and payer information.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {string} expenseId - The unique identifier of the expense
   * @returns {Promise} The expense data
   * @throws {NotFoundException} If expense with given ID is not found or doesn't belong to the trip
   */
  async getExpense(tripId: string, expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, tripId },
      include: {
        paidByUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        images: true,
      },
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

  /**
   * Settles an expense split for a user.
   *
   * @param {string} expenseId - The expense ID
   * @param {string} userId - The user ID
   * @returns {Promise} The updated expense split
   */
  async settleExpenseSplit(expenseId: string, userId: string) {
    const split = await this.prisma.expenseSplit.findUnique({
      where: {
        expenseId_userId: {
          expenseId,
          userId,
        },
      },
    });

    if (!split) {
      throw new NotFoundException('Expense split not found');
    }

    return this.prisma.expenseSplit.update({
      where: {
        expenseId_userId: {
          expenseId,
          userId,
        },
      },
      data: {
        isSettled: true,
        settledAt: new Date(),
      },
    });
  }

  /**
   * Calculates the balance summary for a user in a trip.
   * Returns how much the user paid vs owes, and their net balance.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID
   * @returns {Promise} Balance summary
   */
  async getUserBalanceSummary(tripId: string, userId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { tripId },
      include: {
        paidByUser: true,
        splits: {
          include: {
            user: true,
          },
        },
      },
    });

    let totalPaid = 0;
    let totalOwed = 0;
    const owesTo: Record<string, { amount: number; user: any }> = {};
    const owedBy: Record<string, { amount: number; user: any }> = {};

    for (const expense of expenses) {
      // Calculate what user paid
      if (expense.paidByUserId === userId) {
        totalPaid += expense.amountDestinationMinor;
      }

      // Calculate what user owes for this expense
      const userSplit = expense.splits.find((s) => s.userId === userId);
      if (userSplit) {
        totalOwed += userSplit.amountOwed;
      }

      // Calculate debts between users
      if (expense.paidByUserId === userId) {
        // Other people owe this user
        for (const split of expense.splits) {
          if (split.userId !== userId && !split.isSettled) {
            if (!owedBy[split.userId]) {
              owedBy[split.userId] = { amount: 0, user: split.user };
            }
            owedBy[split.userId].amount += split.amountOwed;
          }
        }
      } else {
        // This user owes the payer
        const userSplit = expense.splits.find((s) => s.userId === userId);
        if (userSplit && !userSplit.isSettled && expense.paidByUser) {
          const payerId = expense.paidByUserId;
          if (payerId) {
            if (!owesTo[payerId]) {
              owesTo[payerId] = { amount: 0, user: expense.paidByUser };
            }
            owesTo[payerId].amount += userSplit.amountOwed;
          }
        }
      }
    }

    return {
      totalPaid,
      totalOwed,
      netBalance: totalPaid - totalOwed, // positive = owed money, negative = owes money
      owesTo,
      owedBy,
    };
  }

  /**
   * Gets all balances for a trip (who owes whom).
   *
   * @param {string} tripId - The trip ID
   * @returns {Promise} List of balances between all users
   */
  async getTripBalances(tripId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { tripId },
      include: {
        paidByUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        splits: {
          where: { isSettled: false },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    const balances: Record<string, Record<string, number>> = {};

    for (const expense of expenses) {
      const payerId = expense.paidByUserId;
      if (!payerId) continue;

      for (const split of expense.splits) {
        if (split.userId === payerId) continue; // Don't owe themselves

        if (!balances[split.userId]) {
          balances[split.userId] = {};
        }
        if (!balances[split.userId][payerId]) {
          balances[split.userId][payerId] = 0;
        }
        balances[split.userId][payerId] += split.amountOwed;
      }
    }

    return balances;
  }
}
