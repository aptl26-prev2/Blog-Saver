const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const returnedBlogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(returnedBlogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const { user } = request

  const blog = new Blog({
    title,
    author,
    likes: likes || 0,
    url,
    user: user._id
  })

  const returnedBlog = await blog.save()

  user.blogs = user.blogs.concat(returnedBlog)
  await user.save()

  response.status(201).json(returnedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { user } = request
  const blog = await Blog.findById(request.params.id)
  if (!blog || blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: 'token invalid or missing'
    })
  }

  await blog.delete()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, likes, url } = request.body

  const returnedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, likes: likes || 0, url },
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(returnedBlog)
})

module.exports = blogsRouter
