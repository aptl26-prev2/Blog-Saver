const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const existingUser = (await User.find({}))[0]
  const objArr = helper.initialBlogs.map((blog) => (
    new Blog({ ...blog, user: existingUser._id.toString() })
  ))
  const promiseArr = objArr.map((obj) => obj.save())
  await Promise.all(promiseArr)
}, 30000)

test('get request returns correct blogs', async () => {
  const blogsInDb = await helper.blogsInDb()

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  response.body.forEach((blog) => {
    blog.user = blog.user.id
  })

  expect(response.body).toEqual(JSON.parse(JSON.stringify(blogsInDb)))
  expect(response.body).toHaveLength(blogsInDb.length)
})

test('unique identifier is "id"', async () => {
  const blogsInDb = await helper.blogsInDb()

  blogsInDb.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('post request adds to database', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const randomUser = (await User.find({}))[0]
  const token = jwt.sign(
    {
      username: randomUser.username,
      id: randomUser._id
    },
    process.env.SECRET
  )

  const newBlog = {
    title: 'Blog from post test',
    author: 'Aghayd deeb from test',
    url: 'http://someurl.com/',
    likes: 50
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${token}`)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  expect(blogsAtEnd.map((blog) => blog.title)).toContain('Blog from post test')
})

test('post request without title fails', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogNoTitle = {
    author: 'test author',
    url: 'http://testurl.com',
    likes: 45
  }
  const randomUser = (await User.find({}))[0]
  const token = jwt.sign(
    {
      username: randomUser.username,
      id: randomUser._id
    },
    process.env.SECRET
  )

  await api
    .post('/api/blogs')
    .send(blogNoTitle)
    .set('Authorization', `bearer ${token}`)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  expect(blogsAtEnd).toEqual(blogsAtStart)
})

test('post request without url fails', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogNoUrl = {
    title: 'test title',
    author: 'test author',
    likes: 45
  }
  const randomUser = (await User.find({}))[0]
  const token = jwt.sign(
    {
      username: randomUser.username,
      id: randomUser._id
    },
    process.env.SECRET
  )

  await api
    .post('/api/blogs')
    .send(blogNoUrl)
    .set('Authorization', `bearer ${token}`)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  expect(blogsAtEnd).toEqual(blogsAtStart)
})

test('post request with no likes defaults to 0', async () => {
  const newBlog = {
    title: 'Blog from default likes test',
    author: 'test author',
    url: 'http://testurl.com'
  }
  const randomUser = (await User.find({}))[0]
  const token = jwt.sign(
    {
      username: randomUser.username,
      id: randomUser._id
    },
    process.env.SECRET
  )

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${token}`)
    .expect(201)

  expect(response.body.likes).toBe(0)
})

test('deleting blog returns code 204 and blog is not in database', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const chosenBlog = blogsAtStart[0]
  const userId = chosenBlog.user.toString()
  const user = await User.findById(userId)

  const token = jwt.sign(
    {
      username: user.username,
      id: user._id
    },
    process.env.SECRET
  )

  await api
    .delete(`/api/blogs/${chosenBlog.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  expect(blogsAtEnd.map((blog) => blog.title)).not.toContain(chosenBlog.title)
})

test(
  'updating notes returns code 200 and notes updated in databse',
  async () => {
    const blogsAtStart = await helper.blogsInDb()
    const chosenBlog = blogsAtStart[0]
    const { title, author, likes, url } = chosenBlog

    await api
      .put(`/api/blogs/${chosenBlog.id}`)
      .send({
        title,
        author,
        likes: likes + 1,
        url
      })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.find((blog) => blog.id === chosenBlog.id).likes)
      .toBe(likes + 1)
  }
)

afterAll(() => {
  mongoose.connection.close()
})
