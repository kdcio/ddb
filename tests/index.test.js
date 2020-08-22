import myRandom from '../src';

describe('My Random Test', () => {
  it('should be 32 characters', () => {
    const rand = myRandom();
    expect(rand.length).toEqual(32);
  });
});
