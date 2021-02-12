import { queryField, arg, nonNull, list, objectType } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const CalcCreditCardsLimitResults = objectType({
  name: 'CalcCreditCardsLimitResults',
  definition(t) {
    t.float('limit');
    t.float('currentLimit');
    t.field('creditCard', { type: 'CreditCard' });
  },
});

export const calcManyCreditCardLimitQuery = queryField('calcManyCreditCardLimit', {
  type: nonNull(list(nonNull('CalcCreditCardsLimitResults'))),
  resolve: async (_parent, args, ctx) => {
    const userId = await getUserId(ctx);

    const results = [];

    const creditCards = await ctx.prisma.creditCard.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    for (let creditCard of creditCards) {
      const operations = await ctx.prisma.operation.findMany({
        select: {
          isPaid: true,
          value: true,
        },
        where: {
          creditCardId: creditCard.id,
          deletedAt: null,
          userId,
        },
      });

      const currentLimit = operations.reduce((acc, operation) => {
        if (operation.isPaid) {
          return acc + operation.value;
        } else {
          return acc - operation.value;
        }
      }, creditCard.limit);

      results.push({
        limit: creditCard.limit,
        currentLimit,
        creditCard,
      });
    }

    return results;
  },
});