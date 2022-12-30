const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Aghyad Deeb',
    url: 'http://www.google.com',
    likes: 40
  },
  {
    title: 'Second Blog',
    author: 'Mayar Deeb',
    url: 'http://www.microsoft.com',
    likes: 420
  }]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}
