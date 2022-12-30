const { mostLikes } = require('../utils/list_helper')

describe('mostLikes', () => {
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

  const multiBlogsNormal = [
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

  const multiBlogsMultipleAnswers = [
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
      likes: 20,
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
      title: 'Fourth Blog',
      author: 'Homam Deeb',
      url: 'http://www.twitter.com',
      likes: 60,
      id: '63a74d2c7c57f655cd1554bc'
    },
    {
      title: 'Fourth Blog',
      author: 'Homam Deeb',
      url: 'http://www.twitter.com',
      likes: 20,
      id: '63a74d2c7c57f655cd1554bc'
    }
  ]

  test('of zero blogs is an empty object', () => {
    expect(mostLikes(zeroBlogs)).toEqual({})
  })

  test('of one blog to be its author and its likes', () => {
    expect(mostLikes(oneBlog)).toEqual({
      author: 'Mazen Deeb',
      likes: 42230
    })
  })

  test('of multiple blogs with single answer to be the answer', () => {
    expect(mostLikes(multiBlogsNormal)).toEqual({
      author: 'Mazen Deeb',
      likes: 42230
    })
  })

  test('of multiple blogs with several answers to be the last', () => {
    expect(mostLikes(multiBlogsMultipleAnswers)).toEqual({
      author: 'Homam Deeb',
      likes: 80
    })
  })
})
