const logger = require('./logger')

const dummy = () => 1

const totalLikes = (arr) => {
  const reducer = (sum, item) => sum + item
  return arr.map((blog) => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (arr) => {
  const reducer = (prevFav, newBlog) => (
    newBlog.likes >= prevFav.likes ? newBlog : prevFav
  )

  return arr[0] ? arr.reduce(reducer, { likes: 0 }) : {}
}

const mostBlogs = (arr) => {
  let ans = []
  const cnt = arr.map((blog) => blog.author)
  cnt.forEach((author) => {
    // eslint-disable-next-line no-unused-expressions
    ans
      .map((object) => object.author)
      .find((storedAuthor) => storedAuthor === author)
      ? ans = ans.map((storedObject) => (
        storedObject.author === author
          ? {
            author,
            blogs: storedObject.blogs + 1
          }
          : storedObject
      ))
      : ans.push({
        author,
        blogs: 1
      })
  })

  const reducer = (prev, item) => (
    item.blogs >= prev.blogs ? item : prev
  )
  return arr[0] ? ans.reduce(reducer, { blogs: 0 }) : {}
}

const mostLikes = (arr) => {
  let ans = []
  arr.forEach((blog) => {
    // eslint-disable-next-line no-unused-expressions
    ans
      .find((object) => object.author === blog.author)
      ? ans = ans.map((storedObject) => (
        storedObject.author === blog.author
          ? {
            author: blog.author,
            likes: storedObject.likes + blog.likes
          }
          : storedObject
      ))
      : ans.push({
        author: blog.author,
        likes: blog.likes
      })
  })

  const reducer = (prev, item) => (
    item.likes >= prev.likes ? item : prev
  )

  return arr[0] ? ans.reduce(reducer, { likes: 0 }) : {}
}

// foreach in array,
// if in ans we add the likes
// if not we add the author with the likes

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
