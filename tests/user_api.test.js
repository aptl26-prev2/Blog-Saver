const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('rootpassword', 10)

  const initialUser = new User({
    username: 'root',
    name: 'root',
    passwordHash
  })

  await initialUser.save()
}, 30000)

describe('adding a valid user', () => {
  test('', async () => {
    const usersAtStart = await helper.usersInDb()

    const testUser = {
      username: 'testuser',
      name: 'test user',
      password: '123435678'
    }

    await api
      .post('/api/users')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usersAtEnd.map((user) => user.username)).toContain('testuser')
  })
})

describe('An invalid user does not get added', () => {
  test('A user without a username does not get added', async () => {
    const usersAtStart = await helper.usersInDb()

    const userWithoutUsername = {
      name: 'no username',
      password: '12345562'
    }

    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map((user) => user.name)).not.toContain('no username')
  })

  test('A user with an existing username does not get added', async () => {
    const usersAtStart = await helper.usersInDb()

    const userWithExistingUsername = {
      username: 'root',
      name: 'existing username',
      password: '12345562'
    }

    await api
      .post('/api/users')
      .send(userWithExistingUsername)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map((user) => user.name))
      .not
      .toContain('existing username')
  })

  test(
    'A user with a username shorter than 3 characters does not get added',
    async () => {
      const usersAtStart = await helper.usersInDb()

      const userWithShortUsername = {
        name: 'short username',
        username: 'short-username',
        password: '1235'
      }

      await api
        .post('/api/users')
        .send(userWithShortUsername)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(usersAtEnd.map((user) => user.name)).not.toContain('short username')
    }
  )

  test('A user without a password does not get added', async () => {
    const usersAtStart = await helper.usersInDb()

    const userWithoutPassword = {
      name: 'no password',
      username: 'no-password'
    }

    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map((user) => user.name)).not.toContain('no password')
  })

  test(
    'A user with a password shorter than 8 characters does not get added',
    async () => {
      const usersAtStart = await helper.usersInDb()

      const userWithShortPassword = {
        name: 'short password',
        username: 'short-password',
        password: '1235'
      }

      await api
        .post('/api/users')
        .send(userWithShortPassword)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(usersAtEnd.map((user) => user.name)).not.toContain('short password')
    }
  )
})

afterAll(() => {
  mongoose.connection.close()
})
