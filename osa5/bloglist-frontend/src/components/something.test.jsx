import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'
import BlogForm from './BlogForm'

import blogsService from '../services/blogs'
import { describe, expect, vi } from 'vitest'

test('renders content and updates likes count', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'testing.test',
    likes: 400,
    user: [{}]
  }

  const mockHandler = vi.fn()
  blogsService.update = vi.fn().mockResolvedValue({
    ...blog,
    likes: blog.likes + 1
  })

  render(<Blog blog={blog} user={{ username: 'testsasa' }} />)
  screen.debug()

  const user = userEvent.setup()
  const button = screen.getByText('♥')
  await user.click(button)

  expect(blogsService.update).toHaveBeenCalledTimes(1)

  const el = screen.getByText('Component testing is done with react-testing-library')
  expect(el).toBeDefined()

  const likesElement = screen.getByText((content, element) => {
    console.log(content)
    return content.includes('401')
  })
  expect(likesElement).toBeDefined()
})

describe('<Blog />', () => {
  let container
  let mockHandler // Define mockHandler in the outer scope

  beforeEach(() => {
    mockHandler = vi.fn()

    const blog = {
      title: 'Component testing is done with react-testing-library',
      url: 'testing.test',
      likes: 400,
      user: [{ username: 'testsasa' }],
      author: 'testauthor'
    }

    container = render(
      <Blog blog={blog} user={{ username: 'testsasa' }} onLike={mockHandler} >
      </Blog>
    ).container
  })

  test('renders its children', () => {
    screen.getByText('Component testing is done with react-testing-library')
  })

  //5.13
  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
  //5.14
  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
  //5.15
  test('click like button twice', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('♥')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })


})

describe('BlogForm', () => {
  //5.16
  test('BlogForm props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)
    screen.debug()
    const user = userEvent.setup()

    /*     const title = component.getById('title')
    const author = component.getByLabelText('author')
    const url = component.getByLabelText('url') */
    const form = container.querySelector('form')
    //console.log(form)
    console.log(Array.from(form.childNodes)[0].textContent)
    const titleTextNodeIndex = Array.from(form.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('title:'))
    const authorTextNodeIndex = Array.from(form.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('author:'))
    const urlTextNodeIndex = Array.from(form.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('url:'))
    const submitButton = screen.getByText('save and submit')
    //console.log(titleTextNodeIndex,authorTextNodeIndex,urlTextNodeIndex)
    await user.type(titleTextNodeIndex.nextSibling, 'testing of forms could be easier')
    await user.type(authorTextNodeIndex.nextSibling, 'test authoer')
    await user.type(urlTextNodeIndex.nextSibling, 'testthing.test')
    /*     userEvent.type(author, 'testauthor')
    userEvent.type(url, 'testing.test') */


    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'testing of forms could be easier',author:'test authoer',url:'testthing.test' })
  })
})