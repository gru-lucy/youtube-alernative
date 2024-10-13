// @ts-check
const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright')
const path = require('path')
const ScreenshotsPath = 'test/output/playwright/downloadLatest/'
const app = require('../../developer/app.js')
let browser, page
test.beforeAll(async () => {
  browser = await chromium.launch({
    headless: false,
  })
  page = await browser.newPage()
})
test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    await page.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test.describe(`download stable version ${app.name}`, () => {
  test('download', async () => {
    test.setTimeout(60000 * 3)
    const releasesLatestUrl = `https://api.github.com/repos/tanshuai/${app.update.github.repo}/releases/latest`
    const [response] = await Promise.all([
      // Waits for the next response matching some conditions
      page.waitForResponse(response => response.url() === releasesLatestUrl),
      // Triggers the response
      page.goto(releasesLatestUrl)
    ])
    const resJson = await response.json()
    let tagName = resJson.tag_name
    console.log('latest stable version: ', tagName)
    if (typeof tagName === 'undefined') {
      const [response] = await Promise.all([
        // Waits for the next response matching some conditions
        page.waitForResponse(response => response.url() === releasesLatestUrl),
        // Triggers the response
        page.goto(releasesLatestUrl)
      ])
      const resJson = await response.json()
      tagName = resJson.tag_name
      console.log('2: latest stable version: ', tagName)
    }
    await page.goto(app.homepage)
    console.log('web load end!')
    let eleClass
    process.platform === 'darwin' ? eleClass = 'fa-apple'
      : process.platform === 'win32' ? eleClass = 'fa-windows'
        : eleClass = 'fa-linux'
    const classRegex = new RegExp(`${eleClass}`)
    await expect(await page.locator('#btn_download_sys i')).toHaveClass(classRegex, { timeout: 30000 })
    await page.waitForTimeout(5000)
    console.log('start download!')
    const [download] = await Promise.all([
      // Start waiting for the download
      page.waitForEvent('download'),
      // Perform the action that initiates download
      page.locator('#btn_download_sys').click(),
    ]);
    // Wait for the download process to complete
    const fileSuggestedFilename = download.suggestedFilename()
    console.log('download file name: ', fileSuggestedFilename)
    let fileExt
    process.platform === 'darwin' ? fileExt = 'dmg'
      : process.platform === 'win32' ? fileExt = 'msi'
        : fileExt = 'deb'
    const regex = new RegExp(`^${app.name.toLowerCase()}-${tagName}\.${fileExt}$`)
    expect(regex.test(fileSuggestedFilename)).toBe(true)

    const targetPath = path.resolve(__dirname, `../../${app.name.toLowerCase()}.${fileExt}`)
    console.log(targetPath)
    await download.saveAs(targetPath)

    await page.waitForTimeout(1000)
  })
})