const blogsRouter = require('express').Router()
const summarize = require('../summary/summarize')
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', userExtractor, async (request, response) => {
  const { token } = request
  if (!token) {
    return response.status(401).json({
      error: 'token invalid or missing'
    })
  }

  const returnedBlogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(returnedBlogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const { user } = request
  const description = await summarize(url)

  const blog = new Blog({
    title,
    author,
    likes: likes || 0,
    url,
    user: user._id,
    description
  })

  const returnedBlog = await blog.save()

  user.blogs = user.blogs.concat(returnedBlog)
  await user.save()

  response
    .status(201)
    .json(returnedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { user } = request
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (!blog || blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: 'token invalid or missing'
    })
  }

  await blog.delete()

  user.blogs = user.blogs.filter((b) => b.id !== blogId)
  await user.save()

  response.status(204).end()
})

// Editing enitre blog
blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { title, author, likes, url } = request.body
  const { user } = request
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (!blog || blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: 'token invalid or missing'
    })
  }

  const returnedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { title, author, likes: likes || 0, url },
    { new: true, runValidators: true, context: 'query' }
  )

  user.blogs = user.blogs.filter((b) => b.id !== blogId)
  await user.save()

  response.json(returnedBlog)
})

// Liking Blog
blogsRouter.put('/like/:id', userExtractor, async (request, response) => {
  const { title, author, likes, url } = request.body
  const { user } = request
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (!blog) {
    return response.status(401).json({
      error: 'token invalid or missing'
    })
  }

  const alreadyLiked = blog.likesUsers.find((id) => (
    id.toString() === user._id.toString()
  ))

  if (alreadyLiked) {
    return response.status(400).json({
      error: 'Cannot like blog twice'
    })
  }

  const returnedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      title,
      author,
      likes: likes || 0,
      url,
      likesUsers: blog.likesUsers.concat(user._id.toString())
    },
    { new: true, runValidators: true, context: 'query' }
  )

  user.blogs = user.blogs.filter((b) => b.id !== blogId)
  await user.save()

  response.json(returnedBlog)
})

module.exports = blogsRouter
