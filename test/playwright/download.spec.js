/* eslint-disable no-empty-pattern */
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { parseCSV, get2DArray } = require('../utils/getCSV')
// get random email
const app = require('../../developer/app.js')
let window, windows, electronApp, basePage, homePage
const ScreenshotsPath = 'test/output/playwright/main.spec/'
let from
let to
if (process.platform === 'win32') {
  from = 'test1'
  to = 'test2'
} else if (process.platform === 'linux') {
  from = 'test3'
  to = 'test4'
} else {
  from = 'test5'
  to = 'test6'
}
from = from + process.env.TEST_EMAIL_DOMAIN
to = to + process.env.TEST_EMAIL_DOMAIN
const taskGroup = [
  {
    groupName: 'group1',
    startNum: '10',
    endNum: '15'
  }
]
test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      '--inspect=5858',
      electronMainPath
    ]
  })
  // Evaluation expression in the Electron context.
  await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath()
  })
  // Get the first window that the app opens, wait if necessary.
  window = await electronApp.firstWindow()

  await window.waitForTimeout(6000)
  // should main window
  windows = electronApp.windows()

  for (const win of windows) {
    if (await win.title() === 'Alphabiz') window = win
  }
  console.log('windows title:' + await window.title())
  // new Pege Object Model
  basePage = new BasePage(window)
  homePage = new HomePage(window)
  basePage.checkForPopup()
})
test.beforeEach(async () => {
  await window.evaluate(() => localStorage.clear())
})
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    // await window.waitForTimeout(10000)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})

test('close set default', async () => {
  try {
    await basePage.defaultAppAlert.waitFor({ timeout: 3000 })
    await basePage.noShowAgainBtn.click()
    console.log('dont show again')
  } catch (error) {
    console.log('no wait for btn[dont show again]')
  }
})

for (const tg of taskGroup) {
  test.describe(`${tg.groupName}`, () => {
    test.beforeEach(async () => {
      const message = await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
      if (message == "success") {
        await basePage.waitForAllHidden(await basePage.alert)
      }
      const inHome = await window.locator('.left-drawer-menu .q-item:has-text("home").active-item').count()
      if (inHome > 0) {
        console.log('当前在首页')
        console.log('检查是否存在Follow菜单项')
        //等待
        await basePage.waitForSelectorOptional('.left-drawer-menu >> text=following', { timeout: 10000 }, '不可见')
        const followExist = await window.locator('.left-drawer-menu >> text=following').count() //小屏（不可见但存在）
        if (followExist > 0) {
          console.log('有')
        } else {
          console.log('没有')
          const firstChannel = await basePage.waitForSelectorOptional('.channel-card >> nth=5', { timeout: 60000 }, '没有出现')
          if (firstChannel) {
            if (!await libraryPage.channelSelected.isVisible()) {
              console.log('选中第一个频道')
              await libraryPage.chanel1Local.click(); //局部推荐页的第一个频道定位
              console.log('成功选中')
            }
            console.log('点击Follow')
            // 3. 点击Follow按钮
            if (await libraryPage.channelFollowsBtn.isVisble()) {
              await libraryPage.channelFollowsBtn.click()
            }
            console.log('成功Follow了一个频道')
            if (await basePage.followingLink.isVisible()) {
              console.log('菜单中出现了Follow选项')
            }
          }
        }
        console.log('等待主页中的频道出现，否则稍等片刻会强制跳转回主页')
        const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
        if (mainLoad) console.log('已出现，页面加载完毕')
      }
      await window.waitForLoadState()
      await window.waitForTimeout(2000)
    })
    test.skip('reset task', async () => {
      await basePage.jumpPage('downloadingStatus')
      await homePage.searchBtn.click({ force: true })
      if (await homePage.downRemoveAllBtn.isEnabled()) {
        await homePage.downRemoveAllBtn.click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
      }
      await basePage.jumpPage('uploadingStatus')
      if (await homePage.upRemoveAllBtn.isEnabled()) {
        await homePage.upRemoveAllBtn.click()
        await homePage.removeAutoUploadFilesChk.click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
      }
      await basePage.jumpPage('downloadedStatus')
      if (await homePage.clearHistoryBtn.isEnabled()) {
        await homePage.clearHistoryBtn.click()
        await homePage.deleteBtn.click()
      }
    })
    test('add task', async () => {
      if (process.platform === 'darwin') {
        test.setTimeout(60000 * 10)
      } else {
        test.setTimeout(60000 * 5)
      }
      await basePage.jumpPage('downloadingStatus')
      await homePage.searchBtn.click({ force: true })
      const val = await parseCSV('test/samples/Movie list.csv')
      const magnetArray = get2DArray(val, 6)
      for (let j = 0, len = magnetArray.length; j < len; j++) {
        if ((j > tg.startNum && j <= tg.endNum) && magnetArray[j] !== '') {
          await homePage.downloadTorrent(magnetArray[j])
          if (process.platform === 'darwin') await window.waitForTimeout(5000)
        }
      }
      await window.waitForTimeout(5000)
    })
    test('wait finish', async () => {
      const timeout = 120 * 60000
      test.setTimeout(timeout)
      // 确认添加了5个任务，等待任务完成
      const allCard = await homePage.allCard
      const downloadNum = await allCard.count()
      console.log(`${tg.groupName} downloadNum: ` + downloadNum)
      // expect(downloadNum).toBe(5)
      await basePage.waitForAllHidden(allCard, timeout, 30000)
      // let waitTime = 0
      // while (1) {
      //   if (waitTime >= timeout) break
      //   const allCardStatus = await allCard.evaluateAll(elements => elements.map(element => element.hidden))
      //   // console.log('allCardStatus', allCardStatus)
      //   if (!allCardStatus.includes(false)) {
      //     console.log('all task card hidden! wait task end!')
      //     await window.waitForTimeout(3000)
      //     break
      //   }
      //   await window.waitForTimeout(30000)
      //   waitTime += 30
      // }
      // expect(waitTime).toBeLessThan(timeout)
    })
    test('check task', async () => {
      await basePage.jumpPage('uploadingStatus')
      await window.waitForLoadState()
      await window.waitForTimeout(3000)

      const allCard = await homePage.allCard
      const uploadNum = await allCard.count()
      console.log(`${tg.groupName} uploadNum: ` + uploadNum)
      // expect(uploadNum).toBe(5)
    })
  })
}
