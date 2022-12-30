const { dummy } = require('../utils/list_helper')

test('dummy returns one', () => {
  expect(dummy([2, 3, 3])).toBe(1)
})
