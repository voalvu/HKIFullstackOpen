const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.waitForTimeout(100)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  let txtBoxes = await page.getByRole('textbox').all()
    await txtBoxes[0].fill(content[0])
    await txtBoxes[1].fill(content[1])
    await txtBoxes[2].fill(content[2])

  await page.getByRole('button', { name: 'save and submit' }).click()
  return
}

const logoutWith = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}
export { loginWith, createBlog, logoutWith }