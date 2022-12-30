const { totalLikes } = require('../utils/list_helper')

describe('total likes', () => {
  const zeroBlogs = []

  const oneBlog = [
    {
      title: 'Third Blog',
      author: 'Mazen Deeb',
      url: 'http://www.facebook.com',
      likes: 42230,
      id: '63a74447cdbbcba4a22c8135'
    }
  ]

  const multiBlogs = [
    {
      title: 'First Blog',
      author: 'Aghyad Deeb',
      url: 'http://www.google.com',
      likes: 40,
      id: '63a73a2dd776c2afc833baf3'
    },
    {
      title: 'Second Blog',
      author: 'Mayar Deeb',
      url: 'http://www.microsoft.com',
      likes: 420,
      id: '63a73a47d776c2afc833baf5'
    },
    {
      title: 'First Blog',
      author: 'Aghyad Deeb',
      url: 'http://www.google.com',
      likes: 40,
      id: '63a73a4ad776c2afc833baf7'
    },
    {
      title: 'First Blog',
      author: 'Aghyad Deeb',
      url: 'http://www.google.com',
      likes: 40,
      id: '63a73a5bd776c2afc833baf9'
    },
    {
      title: 'Third Blog',
      author: 'Mazen Deeb',
      url: 'http://www.facebook.com',
      likes: 42230,
      id: '63a74447cdbbcba4a22c8135'
    },
    {
      title: 'First Blog',
      author: 'Aghyad Deeb',
      url: 'http://www.google.com',
      likes: 40,
      id: '63a7444ccdbbcba4a22c8137'
    },
    {
      title: 'First Blog',
      author: 'Aghyad Deeb',
      url: 'http://www.google.com',
      likes: 40,
      id: '63a74462cdbbcba4a22c813a'
    },
    {
      title: 'Fourth Blog',
      author: 'Homam Deeb',
      url: 'http://www.twitter.com',
      likes: 430,
      id: '63a74d2c7c57f655cd1554bc'
    }
  ]

  test('of empty array', () => {
    expect(totalLikes(zeroBlogs)).toBe(0)
  })

  test('of one blog', () => {
    expect(totalLikes(oneBlog)).toBe(oneBlog[0].likes)
  })

  test('of multiple blogs', () => {
    expect(totalLikes(multiBlogs)).toBe(43280)
  })
})
