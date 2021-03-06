import { inputObjectType } from 'nexus';

export const CreditCardCreateInput = inputObjectType({
  name: 'CreditCardCreateInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.float('limit');
    t.nonNull.field('brand', { type: 'CreditCardBrand' });
    t.nonNull.string('accountId');
  },
});

export const CreditCardUpdateInput = inputObjectType({
  name: 'CreditCardUpdateInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.float('limit');
    t.nonNull.field('brand', { type: 'CreditCardBrand' });
    t.nonNull.string('accountId');
  },
});
