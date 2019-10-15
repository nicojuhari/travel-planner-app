import { isFutureDate } from './helpers';

test('Next year is a Future date = true', () => {
    expect(isFutureDate('12.12.2020', Date.now())).toBe(true);
  });