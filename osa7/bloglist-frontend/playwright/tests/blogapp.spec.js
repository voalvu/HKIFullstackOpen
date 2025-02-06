const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, logoutWith } = require('./helper')
const exp = require('constants')
const { wait } = require('@testing-library/user-event/dist/cjs/utils/index.js')
test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')
  // await page.waitForSelector('text=blogs');
  //console.log(await page.content())
  await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()

  //await expect(page.getByText('')).toBeVisible()
})

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data:{ name:'testguy', username:'testguy1', password:'test' } })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')

  })

  test('login form button shown and when pressed form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByTestId('username')).toBeVisible()

  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('logged in user mluukkai')).toBeVisible()
  })

  describe('when logged in', async () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
    test('a new blog can be created', async ({ page }) => {
      // ...                    //console.log(form)
      let blog = ['testing of forms could be easier','test authoer','testthing.test']
      await createBlog(page, blog)
      //`a new blog testing of forms could be easier by test authoer added`
      await expect(page.locator('#notification')).toContainText(`a new blog ${blog[0]} by ${blog[1]} added`)
    })

  })
  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = await page.locator('#notification')
    await expect(errorDiv).toContainText('error logging in')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })
  test('logged in user can create a new blog ', async ({ page }) => {
    let blog = ['new blog','blogger','test.test']
    await loginWith(page, 'mluukkai', 'salainen')

    await createBlog(page, blog)
  })
  test('can like a blog', async ({ page }) => {
    let blog = ['likeable','blogger','test.test']
    await loginWith(page, 'mluukkai', 'salainen')
    // await page.screenshot('before.png')
    await createBlog(page, blog)
    await page.getByText('view').click()
    const likesText = await page.locator('text=likes:').textContent()
    const likes = parseInt(likesText.match(/\d+/)[0])

    await page.locator('#like-button').click()

    await page.waitForTimeout(1000)

    const updatedLikesText = await page.locator('text=likes:').textContent()
    expect(updatedLikesText).toContain(`likes: ${likes + 1}`)
  })

  test('logged in user can delete newly created blog ', async ({ page }) => {
    await page.on('dialog', async dialog => {
      await dialog.accept()
    })

    let blog = ['new blog to be deleted','blogger','test.test']
    await loginWith(page, 'mluukkai', 'salainen')

    await createBlog(page, blog)
    await page.getByText('view').click()
    // await page.screenshot({ path: 'screenshot.png' })
    await page.getByRole('button', { name:'remove' }).click()


    // await page.screenshot({ path: 'after_screenshot.png' })
    await expect(page.locator(`text=${blog[0]}view`)).not.toBeVisible({ timeout: 1000 }) //
  })

  test('remove button only for blog creator ', async ({ page }) => {
    let blog = ['new blog THAT wont be deleted','blogger','test.test']
    await loginWith(page, 'mluukkai', 'salainen')

    await createBlog(page, blog)
    await page.getByText('view').click()
    await expect(page.locator('text=remove')).toBeVisible()
    // await page.screenshot({ path: 'screenshot.png' })
    await page.getByRole('button', { name: 'cancel' }).click()
    await expect(page.locator('text=remove')).not.toBeVisible()

    await logoutWith(page)
    await page.waitForTimeout(1000)
    await loginWith(page, 'testguy1', 'test')
    await page.getByText('view').click()
    await expect(page.locator('text=remove')).not.toBeVisible()

    // await page.screenshot({ path: 'after_screenshot.png' })
  })

  test('make sure blogs are in like order', async ({ page, request }) => {
    //creating accounts so it wokrs as if different users could cast only one like

    for (let i = 0; i < 5; i++) {
      await request.post('http://localhost:3003/api/users', { data:{ name:`testguy${i}`, username:`testguy${i}`, password:'test' } })
    }
    await loginWith(page, 'mluukkai', 'salainen')
    //await page.waitForTimeout(1000)
    for (let i = 0; i < 5; i++) {
      await createBlog(page, [`new blog ${i}`,'mik','test.test'])
      await page.waitForTimeout(500)
      //await page.getByText('view').click()
    }

    await logoutWith(page)
    // await page.screenshot({ path: 'after_screenshot.png' })

    const content = await page.content()
    //console.log(content)

    const view_buttons = await page.locator('button:has-text("view")')
    console.log(content)
    console.log(await view_buttons.all())
    await view_buttons.all().then(async (buttonElements) => {
      for (const button of buttonElements) {
        await button.click()
      }
    })

    // await page.screenshot({ path: 'afterr_screenshot.png' })
    const like_buttons = await page.locator('#like-button')

    for (let i = 0; i < 4; i++) {

      await loginWith(page, `testguy${i}`, 'test')
      await page.waitForTimeout(100 )
      for (let j = i; j>=0; j--){

        await like_buttons.nth(j).click()
        //await page.waitForTimeout(200)
      }
      //   await page.screenshot({ path: i+'afterr_screenshot.png' })
      await logoutWith(page)
    }

    await loginWith(page, 'mluukkai', 'salainen')
    await like_buttons.nth(3).click()

    await like_buttons.nth(3).click()
    // await page.screenshot({ path: '4thnoyopenafterr_screenshot.png' })

    await like_buttons.nth(4).click()
    await like_buttons.nth(4).click()
    await like_buttons.nth(4).click()
    await like_buttons.nth(4).click()
    await like_buttons.nth(4).click()
    await like_buttons.nth(4).click()



    await page.reload()
    await page.waitForTimeout(500)

    // await page.screenshot({ path: 'final_afterr_screenshot.png' })
    const contentFinally = await page.content()
    const likesList = []
    const regex = /likes: (\d+)/g
    let match
    while ((match = regex.exec(contentFinally)) !== null) {
      likesList.push(parseInt(match[1]))
    }
    console.log(likesList)

    for (let i = 0; i < likesList.length - 1; i++) {
      expect(likesList[i]).toBeGreaterThanOrEqual(likesList[i + 1])
    }
  })
})