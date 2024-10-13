/* eslint-disable no-empty-pattern */
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const electronMainPath = require('../../test.config.js').electronMainPath
const { BasePage } = require('./models/basePage')
const { HomePage } = require('./models/homePage')
const { PlayerPage } = require('./models/playerPage')
const { CreditsPage } = require('./models/creditsPage')
const { BasicPage } = require('./models/basicPage')
const { LibraryPage } = require('./models/libraryPage')

const { calculation } = require('../utils/calculation')
const app = require('../../developer/app.js')
const { addConsoleHandler } = require('selenium-webdriver/lib/logging.js')
let window, windows, electronApp, basePage, homePage, playerPage, creditsPage, basicPage, libraryPage
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
const btData = [
  {
    btName: 'uTorrent Web Tutorial Video',
    magnetLink: `${app.shortProtocol}://AWGzuIVsSDnt9R9cI0ZZm2vsUkFF`,
    isStreaming: 0,
    isDelete: 0,
    fileType: 'folder',
    folder: [
      'uTorrent Web Tutorial Video.mp4',
      'utweb-cover-art.png'
    ]
  },
  // {
  //   btName: 'The WIRED CD - Rip. Sample. Mash. Share',
  //   magnetLink: `${app.protocol}://The+WIRED+CD+-+Rip.+Sample.+Mash.+Share/AaiP2llU6JF4w3Jxamp4uBgO1NrT&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AQ2AZRdABhgxG8IY8MSV1K_VKsx55jv8ahwgTX5jKB2up6HR8eDRb6BvCkztx6mgEb++b2k0T1kLtZV_Z3BAncfL9IZEXrCc2i3lZ1gwntqOdl5Y6U4ITwioxtrEFVVqgnT7fNc84aa4e4nbkoHiGnrIyjqiDO6Th6ghL6fgab+SzF6QoLdOc_CzeSlbolwRBY6XVrJDoXv0R2cuLjOd2K0fNlkoov1603Ml_lh_5EboBPwH+OOmSVNhU2VlV8_JhxjvAyuSH2BztiDRz1bVFkIdjxPR234SGYsuJpslus1CEnVW+bjTYwN6URFizlYFNVAeUEyN6RuAJBa8Zr5R9rTZj8ZZt9oSUK2igP7XtUePDYebMj3TjlP1dIp+i_HBQOtJ+Yd4zFcLi1aeQteo2DP694kshUMvyLM1ZBS6FdnwVLNCGFZ_TEBIhR73Nm2DXdas086dQFXAEOmjwprTaPyWwRqVrEXn9uuWDFUe8TbJYK6hQbfFdTCM8Mq4dNnAQqcepFfmbE4PAd+m7zOGXFARinVN+L_ZK16ADAA4uMAAawDtwgAAANYnWQ+MA2LAgAAAAABWVo=`,
  //   testName: `${app.protocol}- `,
  //   isStreaming: 0,
  //   isDelete: 0,
  //   fileType: 'folder',
  //   folder: [
  //     '01 - Beastie Boys - Now Get Busy.mp3',
  //     'poster.jpg',
  //     'README.md'
  //   ]
  // },
  // {
  //   btName: 'sintel.mp4',
  //   magnetLink: `${app.protocol}://sintel.mp4/AWqXWb_9XAr2UxmXn7eDIYn088Nd&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AQRAaRdABhgxG8IY8MSV1K_VKsx55jv7TtYgTX5jR4Gd0xW21GujSgT78cqpgvGEoguoHnxCp28AResLp5j3v+1zn6SGnlgSREgr2M98fcRbLhX1EMo1oRnbPkIvZV5b+mk82+ZDT1XmkWHdIRdvUH2N4x6Krm5NiF49+qS7+OHCpUQbNHPkfEF3TUbotiPK4NoHxZfWXI3Zb+f2Yd0Ejt3YxNjpUS_HI1tKB9TN6+axgjPyUbe9Rd222k8QSudkxgJwRbz98cIT9D99pVApyQxU8dExXfe5VTSxcOmMdmtZmmfbinRinM8Wqe2zxfUfEKecjcvChshZ48tN5fkHAtYvJ_+3_L97Xd7gNgkdZCn73b3YIN_fTiqJPR1K7pBVh7v8tBNlnO4doUbgbs9ccZkdAjMwiCHv6Moya6ttYYmxJl5syqj8GisfH6PCsP3tlNIOaO5xRy11FQ+q4sQjQgkTGEdZoHkAJ4NFV10yS+vIXMnUysMVgHmdh51T1wfGOIzRD54QtWZ4MRQyY_i9hbP6KjoBgqw4l92RD2X2TI9KH1siZvXLEsZLgCMxKNSAAG8A5IIAACUBafwPjANiwIAAAAAAVla`,
  //   testName: `${app.protocol}- `,
  //   isStreaming: 0,
  //   isDelete: 0,
  //   fileType: 'video_file',
  //   folder: [
  //     'sintel.mp4'
  //   ]
  // },
  // {
  //   btName: 'sintel.mp4',
  //   magnetLink: 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4',
  //   isStreaming: 0,
  //   isDelete: 0,
  //   fileType: 'video_file'
  // }
  {
    btName: 'bbb_sunflower_1080p_30fps_normal.mp4',
    magnetLink: `${app.protocol}://bbb_sunflower_1080p_30fps_normal.mp4/AYhZSqrL3kDvPiUQxHN07AqjlsCO&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AMtAW1dABhgxG8IY8MSV1K_VKsx55jv8ahwgTX5jKB2up6HR8eDRb6BvCkztx6mgEb++b2O2b3K3oD_twGGSig+KBe78TiXxGleWSnbRlWB69ZvfD70oiEhlTlty+AtgRrH+kzx7fD910Bx9Uf4_7Js+dNII8l3GxJ4B175xFepPURPh6AnWzB9cVwPtgxmF4hSxh7Z_thhoZBH4KP2yrr9bIPbiBIfR4rnRGgQhoMYOe1vRpDVUFDC_y_tNp17fwwfvvvAj5elliGbJODzL4qEq_HB_lUhXHCZDoPbg1kCa8TfDkYL+2wWqViHW5YjR6DIxnlf8AAswdMmYa5OLaHRfCaqLtreJ_iohdSxAp2rckxS001Zp7ra+N_aIUxh9H3a96O2YBfWo_2PdmbBhT1A8s20u6d9cVtOTDvkpvOb8aiGcUn+swScBUm1SBP2DgoZJ6zeNvQcBQ9WKwD51ImdTrOxf2ShB64iMvUV0iO_3x3WAAAAAJcI4UEAAYUDrgYAAOI5sWM+MA2LAgAAAAABWVo=`,
    testName: `Streaming ${app.protocol}- `,
    isStreaming: 1,
    isDelete: 0,
    fileType: 'video_file'
  },
  {
    btName: 'bbb_sunflower_1080p_30fps_normal.mp4',
    magnetLink: `${app.protocol}://bbb_sunflower_1080p_30fps_normal.mp4/AYhZSqrL3kDvPiUQxHN07AqjlsCO&_Td6WFoAAAFpIt42AgAhARwAAAAQz1jM4AMtAW1dABhgxG8IY8MSV1K_VKsx55jv8ahwgTX5jKB2up6HR8eDRb6BvCkztx6mgEb++b2O2b3K3oD_twGGSig+KBe78TiXxGleWSnbRlWB69ZvfD70oiEhlTlty+AtgRrH+kzx7fD910Bx9Uf4_7Js+dNII8l3GxJ4B175xFepPURPh6AnWzB9cVwPtgxmF4hSxh7Z_thhoZBH4KP2yrr9bIPbiBIfR4rnRGgQhoMYOe1vRpDVUFDC_y_tNp17fwwfvvvAj5elliGbJODzL4qEq_HB_lUhXHCZDoPbg1kCa8TfDkYL+2wWqViHW5YjR6DIxnlf8AAswdMmYa5OLaHRfCaqLtreJ_iohdSxAp2rckxS001Zp7ra+N_aIUxh9H3a96O2YBfWo_2PdmbBhT1A8s20u6d9cVtOTDvkpvOb8aiGcUn+swScBUm1SBP2DgoZJ6zeNvQcBQ9WKwD51ImdTrOxf2ShB64iMvUV0iO_3x3WAAAAAJcI4UEAAYUDrgYAAOI5sWM+MA2LAgAAAAABWVo=`,
    isStreaming: 0,
    isDelete: 0,
    fileType: 'video_file'
  }
]

test.beforeAll(async () => {
  // Set timeout for this hook.
  test.setTimeout(180000)
  // Launch Electron app.
  electronApp = await electron.launch({
    timeout: 90000,
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
    console.log(await win.title())
    if (await win.title() === 'Alphabiz') window = win
  }
  // new Pege Object Model
  basePage = new BasePage(window)
  homePage = new HomePage(window)
  playerPage = new PlayerPage(window)
  creditsPage = new CreditsPage(window)
  basicPage = new BasicPage(window)
  libraryPage = new LibraryPage(window)
  // // fix electron test - ServiceWorker is not defined
  // await basePage.newReload()
  basePage.checkForPopup()
})
test.afterAll(async () => {
})
test.beforeEach(async () => {
})
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Timeout! Screenshots => ${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png`)
    // await window.waitForTimeout(10000)
    await window.screenshot({ path: `${ScreenshotsPath}${testInfo.title}-retry-${testInfo.retry}-fail.png` })
  }
})
test('close set default', async () => {
  console.log('刷新')
  await basePage.newReload()
  try {
    await basePage.defaultAppAlert.waitFor({ timeout: 3000 })
    await basePage.noShowAgainBtn.click()
    console.log('dont show again')
  } catch (error) {
    console.log('no wait for btn[dont show again]')
  }
})

test('清除磁力列表', async () => {
  test.setTimeout(60000 * 4)
  await window.waitForLoadState()
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
      console.log('等待出现局部推荐页面的第一个频道')
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
  await homePage.clearTask()
})

// test('Play while you download', async ({ page }) => {
//   await page.locator().click()
//   await page.locator().click()
// })

test.describe('播放视频', () => {
  test.beforeEach(async () => {
    if (process.platform === 'darwin') test.setTimeout(60000 * 5)
    else test.setTimeout(60000 * 3)
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
        console.log('等待出现局部推荐页面的第一个频道')
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
    await window.waitForTimeout(1000)
    console.log('准备跳转到播放器页')
    await basePage.jumpPage('playerLink')
    console.log('跳转成功')
  })
  test('avi类型', async () => {
    const media = 'test/cypress/fixtures/samples/GoneNutty.avi'
    // Upload
    await window.waitForTimeout(5000)
    console.log('准备上传一个avi类型视频--GoneNutty.avi')
    try{
      await playerPage.fileInput.setInputFiles(media, { timeout: 60000 })
    }catch(error){
      console.log(error)
      test.skip()
    }
    console.log('开始上传')
    await window.waitForLoadState()
    // should video can play
    console.log('等待视频播放')
    await window.waitForTimeout(5000)
    const progressControl = await playerPage.stopPlay
    await playerPage.playPage.click()
    console.log('点击playPage, 断言可以看到视频暂停按钮')
    await expect(progressControl).toBeVisible({ timeout: 30000 })
    console.log('断言成功')
    await playerPage.stopPlay.click()
    console.log('点击停止播放')
  })
  test('BlueRay_mkv蓝光视频', async () => {
    const media = 'test/cypress/fixtures/samples/Test-Sample-Tenet.2020.IMAX.2160p.UHD.BluRay.x265.10bit.HDR.DTS-HD.MA.5.1202111171122322.mkv'
    // Upload
    console.log('准备上传一个BlueRay_mkv蓝光视频--Test-Sample-Tenet.mkv')
    try{
      await playerPage.fileInput.setInputFiles(media, { timeout: 60000 })
    }catch(error){
      console.log(error)
      test.skip()
    }
    console.log('上传成功')
    await window.waitForLoadState()
    // should video can play
    await window.waitForTimeout(5000)
    const progressControl = await playerPage.stopPlay
    await playerPage.playPage.click()
    console.log('点击playPage')
    try{
      console.log('断言出现视频暂停按钮')
      await expect(progressControl).toBeVisible({ timeout: 60000 })
      console.log('断言成功')
    }catch(error){
      console.log('断言失败')
      await window.screenshot({ path: `${ScreenshotsPath}看不到按钮.png` })
      console.log('截屏')
      return
    }
  })
})

test.describe('切换语言设置', () => {
  test.describe('在登录页切换语言', () => {
    test.beforeEach(async () => {
      test.setTimeout(60000 * 5)
      // if (process.platform === 'darwin') {
      //   test.skip()
      // }
      console.log('清空本地存储')
      await basePage.clearLocalstorage()
      console.log('回到登陆页')
      await window.waitForTimeout(3000)
    })
    test('CN简体中文', async () => {
      console.log('设置中文')
      await basePage.quickSaveLanguage('CN')
      console.log('设置完毕')
      const signIncardCss = '.q-card:has-text("登录账户")'
      console.log('等待“登录账户”')
      await window.locator(signIncardCss).waitFor()
      console.log('出现')
      await basePage.newReload()
      console.log('刷新界面, 再次验证')
      await window.waitForLoadState()
      console.log('等待“登录账户”')
      await window.locator(signIncardCss).waitFor()
      console.log('出现')
    })
    test('TW繁体中文', async () => {
      await basePage.quickSaveLanguage('TW')
      const signIncardCss = '.q-card:has-text("登錄賬戶")'
      console.log('等待"登錄賬戶"')
      await window.locator(signIncardCss).waitFor()
      console.log('出现')
      await basePage.newReload()
      console.log('刷新界面，再次验证')
      await window.waitForLoadState()
      console.log('等待"登錄賬戶"')
      await window.locator(signIncardCss).waitFor()
      console.log('出现')
    })
    test('EN英文', async () => {
      await basePage.quickSaveLanguage('EN')
      const signIncardCss = '.q-card:has-text("sign in")'
      console.log('等待“sign in”')
      await window.locator(signIncardCss).waitFor()
      console.log('出现')
      await basePage.newReload()
      console.log('刷新界面，再次验证')
      await window.waitForLoadState()
      console.log('等待“sign in”')
      await window.locator(signIncardCss).waitFor()
      console.log('出现')
      if (process.platform === 'darwin') {
        await basePage.clearLocalstorage()
        await window.waitForTimeout(3000)
        await basePage.quickSaveLanguage('EN')
        await basePage.newReload()
        await window.waitForLoadState()
        await window.locator(signIncardCss).waitFor()
        await window.screenshot({ path: `${ScreenshotsPath}signInPageStatus.png` })
      }
    })
  })
  test.describe('主页', () => {
    test.beforeEach(async () => {
      test.setTimeout(60000 * 5)
      if (process.platform === 'darwin' || process.platform === 'linux') {
        test.skip()
      }
    })
    // EN -> CN -> TW -> EN
    test('语言重复切换-EN-CN-TW-EN', async () => {
      // if (process.platform === 'linux'){
      //   test.skip()
      // }
      // 确保语言en
      await basePage.clearLocalstorage()
      await window.waitForTimeout(3000)
      await basePage.quickSaveLanguage('EN')
      console.log('在登陆页设置语言为EN')
      const message = await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1) //登陆
      if (message == "success") {
        await basePage.waitForAllHidden(await basePage.alert)
      }
      await window.waitForLoadState()
      const inHome = await window.locator('.left-drawer-menu .q-item:has-text("home").active-item').count()
      if (inHome > 0) {
        console.log('检查是否存在Follow菜单项')
        //等待
        await basePage.waitForSelectorOptional('.left-drawer-menu >> text=following', { timeout: 10000 }, '不可见')
        const followExist = await window.locator('.left-drawer-menu >> text=following').count() //小屏（不可见但存在）
        if (followExist > 0) {
          console.log('有')
        } else {
          console.log('没有')
          console.log('等待出现局部推荐页面的第一个频道')
          const firstChannel = await basePage.waitForSelector('.channel-card >> nth=5', { timeout: 60000 }, '卡住了, 放弃Follow')
          if(firstChannel){
            if (!await libraryPage.channelSelected.isVisible()) {
              console.log('选中第一个频道')
              await libraryPage.chanel1Local.click(); //局部推荐页的第一个频道定位
              console.log('成功选中')
            }
            console.log('点击Follow')
            // 3. 点击Follow按钮
            await libraryPage.channelFollowsBtn.click();
            console.log('成功Follow了一个频道')
            if (await basePage.followingLink.isVisible()) {
              console.log('菜单中出现了Follow选项')
            }
          }
        }
        const mainLoad = await basePage.waitForSelectorOptional('.post-channel-info', { timeout: 60000 }, "主页在1分钟内没有加载出来")
        if (mainLoad) console.log('已出现，页面加载完毕')
      }
      console.log('EN->CN')
      await basicPage.saveLanguage('EN', 'CN')
      console.log('断言导航栏标题是--基础设置')
      try{
        await expect(await basicPage.headerTitle).toHaveText(/基础设置/, { timeout: 20000 })
        console.log('断言成功')
        console.log('CN->TW')
        await basicPage.saveLanguage('CN', 'TW')
        console.log('断言导航栏标题是--基礎設置')
        await expect(await basicPage.headerTitle).toHaveText(/基礎設置/, { timeout: 20000 })
        console.log('断言成功')
        console.log('TW->EN')
        await basicPage.saveLanguage('TW', 'EN')
        console.log('断言导航栏标题是--Basic')
        await expect(await basicPage.headerTitle).toHaveText(/Basic/, { timeout: 20000 })
        console.log('断言成功')
      }catch(error){
        console.log('断言失败')
      }
    })
    test('确保最后的语言是EN', async () => {
      try{
        console.log('先跳转到基础设置页')
        const basicIcon = window.locator('.q-item:has-text("assignment")')
        await basicIcon.click()
        console.log('点击基础设置')
        console.log('跳转到基础设置页, 断言标题是Basic')
        await expect(await basicPage.headerTitle).toHaveText(/Basic/, { timeout: 5000 })
        console.log('√断言成功')
      }catch(error){
        console.log('×断言失败')
        let flag = false
        for(let i = 0 ; i < 3; i ++)
        {
          console.log('点击语言下拉框, 等待出现选择列表')
          await window.locator('.q-field__append >> nth=0').click()
          if (await window.locator('.q-menu .q-item >> nth = 0').isVisible()){
            flag = true
            break;
          }else{
            console.log(`第${i+1}次点击无效，截图`)
            await window.screenshot({ path: `${ScreenshotsPath}第${i + 1}次点击无效.png` })
          }
        }
        if(!flag){
          test.skip()
        }
        console.log('出现选择列表, 点击第一项就是英语')
        await window.locator('.q-menu .q-item >> nth = 0').click()
        console.log('保存设置')
        await basicPage.saveSetting()
        console.log('成功保存')
        await expect(await basicPage.headerTitle).toHaveText(/Basic/, { timeout: 5000 })
        console.log('√')
      }
    })
  })
})

test.describe('账户设置', () => {
  test('transfer - check bill details 转账-检查账单详细', async () => {
    test.setTimeout(60000 * 5)
    // 转账人账号、密码
    const transferee = from
    const transfereePassword = process.env.TEST_PASSWORD
    // 收款人账号、密码
    const payee = to
    const payeePassword = process.env.TEST_PASSWORD
    const transferAmount = 1
    await window.evaluate(() => localStorage.clear())
    await basePage.newReload()

    // 登录收款人账号
    await basePage.signIn(payee, payeePassword, 1)
    await basePage.jumpPage('creditsLink')
    await window.waitForTimeout(6000)
    const firstHeaderTitle = await basePage.headerTitle.innerText()
    if (!/Credits/.test(firstHeaderTitle)) await basePage.jumpPage('creditsLink')
    await creditsPage.creditsText.click({ force: true })
    // 获取收款人id
    const payeeID = await creditsPage.getID()
    // console.log('payeeID:' + payeeID)
    await window.waitForTimeout(2000)
    const payeePoint = await creditsPage.creditsText.innerText()
    const payeeAfterPoint = Number(payeePoint) + transferAmount
    // 退出收款人账号
    await basePage.signOut()
    await window.waitForTimeout(1000)
    // 登录付款人账号
    await basePage.signIn(transferee, transfereePassword, 1)
    await basePage.jumpPage('creditsLink')
    await window.waitForTimeout(6000)
    const secondHeaderTitle = await basePage.headerTitle.innerText()
    if (!/Credits/.test(secondHeaderTitle)) await basePage.jumpPage('creditsLink')
    await creditsPage.creditsText.click({ force: true })
    // 获取转账人id
    const transfereeID = await creditsPage.getID()
    let transfereePoint = await creditsPage.creditsText.innerText()
    if (Number(transfereePoint) <= 0) {
      console.log('金额不足')
    }
    await window.waitForTimeout(2000)
    transfereePoint = await creditsPage.creditsText.innerText()
    const transfereeAfterPoint = Number(transfereePoint) - transferAmount
    // 转账
    await creditsPage.transfer(payeeID, transferAmount.toString())
    // 查看账单明细
    await creditsPage.checkBillDetail([payeeID, 'Transfer', '-' + transferAmount, 'finish'], 'expense')
    // 断言积分变化是否正确
    await window.waitForTimeout(2000)
    await window.waitForLoadState()
    expect(await creditsPage.creditsText.innerText()).toBe(calculation('reduce', transfereePoint, transferAmount).toString())
    // 退出付款人账号
    await basePage.signOut()
    await window.waitForTimeout(1000)
    // 登录收款人账号
    await basePage.signIn(payee, payeePassword, 1)
    await basePage.jumpPage('creditsLink')
    await window.waitForTimeout(6000)
    const thirdHeaderTitle = await basePage.headerTitle.innerText()
    if (!/Credits/.test(thirdHeaderTitle)) await basePage.jumpPage('creditsLink')
    await window.waitForTimeout(2000)
    // 查看账单
    await creditsPage.checkBillDetail([transfereeID, 'Transfer', transferAmount.toString(), 'finish'], 'income')
    // 断言积分变化是否正确
    expect(await creditsPage.creditsText.innerText()).toBe(payeeAfterPoint.toString())
    await basePage.signOut()
    await window.waitForTimeout(1000)
  })
})

test.describe('download 视频下载', () => {
  for (const bt of btData) {
    test((bt.testName ? bt.testName : '') + bt.btName, async () => {
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
          console.log('等待出现局部推荐页面的第一个频道')
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
      if (bt.btName === 'uTorrent Web Tutorial Video') {
        test.setTimeout(60000 * 5)
      } else if (bt.btName === 'The WIRED CD - Rip. Sample. Mash. Share') {
        test.setTimeout(60000 * 10)
      } else if (bt.btName === 'bbb_sunflower_1080p_30fps_normal.mp4') {
        test.setTimeout(60000 * 15)
      } else if (bt.btName === 'sintel.mp4') {
        test.setTimeout(60000 * 15)
      }
      await window.waitForLoadState()

      // 跳转到 下载中
      console.log('准备跳转到下载中')
      await basePage.jumpPage('downloadingStatus')
      console.log('成功跳转')
      try {
        console.log('等待出现按钮--移除所有')
        await homePage.downRemoveAllBtn.waitFor({ timeout: 5000 })
        console.log('出现')
      } catch (e) {
        console.log('没有出现')
      }
      // 确保切换到卡片模式
      const cardMode = await homePage.toggleCardModeBtn
      console.log('卡片模式是否可见')
      if (await cardMode.isVisible()) {
        console.log('可见')
        await cardMode.click()
        console.log('点击')
      }
      await homePage.searchBtn.click({ force: true })
      console.log('点击查找按钮')
      console.log('等待任务卡片出现')
      if (!await homePage.getCard(bt.btName).isVisible()) {
        console.log('任务卡片不可见')
        await window.waitForTimeout(2000)
      }
      // download bbb_sunflower_1080p_30fps_normal.mp4 下载中状态多等一会
      if ((bt.btName === 'bbb_sunflower_1080p_30fps_normal.mp4' || bt.btName === 'sintel.mp4') && bt.isStreaming === 0) {
        let waitTime = 0
        while (1) {
          if (!await homePage.getCard(bt.btName).isVisible()) {
            waitTime += 3
          } else break
          if (waitTime >= 15) break
          await window.waitForTimeout(3000)
        }
      }
      // 判断 任务 在downloading状态
      if (await homePage.getCard(bt.btName).isVisible()) {
        // 等待下载完成
        console.log('等待下载完成')
        const DownloadStatus = await (await homePage.getCardEle(bt.btName, 'statusText')).innerText()
        //  判断 文件存在，下载完成
        console.log('判断文件存在，下载完成')
        if (DownloadStatus === 'Status: Paused') await homePage.getCardEle(bt.btName, 'resumeBtn').click()
        try {
          await homePage.getCardEle(bt.btName, 'statusText', 'Downloading').click({ timeout: 60000 })
        } catch (error) {
          console.log('准备跳转到--上传中')
          await basePage.jumpPage('uploadingStatus')
          console.log('跳转成功')
          await homePage.searchBtn.click({ force: true })
          console.log('点击查找按钮')
          await homePage.getCardEle(bt.btName, 'statusText', 'Seeding').click({ timeout: 30000 })
        }
      } else {
        // 判断 任务 在seeding状态
        console.log('判断任务在seeding状态')
        console.log('准备跳转到--上传中')
        await basePage.jumpPage('uploadingStatus')
        console.log('跳转成功')
        await homePage.searchBtn.click({ force: true })
        console.log('点击查找按钮')
        await window.waitForTimeout(1000)
        if (!await homePage.getCard(bt.btName).isVisible()) {
          // 任务不存在  bt未开始下载
          console.log('任务不存在，bt未开始下载')
          console.log('准备跳转到--下载中')
          await basePage.jumpPage('downloadingStatus')
          console.log('跳转成功')
          await homePage.searchBtn.click({ force: true })
          console.log('点击查找')
          await homePage.downloadTorrent(bt.magnetLink)
          if (!bt.btName.includes('uTorrent')) {
            await window.click('text=' + bt.btName, { timeout: 5 * 60000 })
            // 等待 任务 加载 验证， 判断任务是 下载中
            console.log('等待任务加载，判断任务是下载中')
            await homePage.getCardEle(bt.btName, 'statusText', 'Downloading').click({ timeout: 5 * 60000 })
          }
        }
      }

      // 等待下载完成
      console.log('等待下载完成')
      if (await homePage.getCardEle(bt.btName, 'statusText').isVisible()) {
        const btStatus = await (await homePage.getCardEle(bt.btName, 'statusText')).innerText()
        if (btStatus === 'Status: Downloading') {
          const progressBar = await homePage.getCardEle(bt.btName, 'processText')
          let oldProgress = parseFloat(/\d{1,3}.\d{0,2}/.exec(await progressBar.innerText()))
          let timestamp = 0
          // wait download
          while (1) {
            if (!await homePage.getCard(bt.btName).isVisible()) break
            const DownloadStatus = await (await homePage.getCardEle(bt.btName, 'statusText')).innerText()
            // console.log('DownloadStatus:' + DownloadStatus)
            if (DownloadStatus !== 'Status: Downloading') {
              break
            }
            const progressBar = await homePage.getCardEle(bt.btName, 'processText')
            const progressPercentage = parseFloat(/\d{1,3}.\d{0,2}/.exec(await progressBar.innerText()))
            // console.log('progressPercentage:' + progressPercentage)
            if (oldProgress === progressPercentage) {
              if (timestamp >= 2 * 60) {
                await window.screenshot({ path: `${ScreenshotsPath}${bt.btName}-download-fail.png` })
                break
              }
              timestamp += 5
            } else if (oldProgress < progressPercentage) timestamp = 0

            oldProgress = progressPercentage
            if (bt.isStreaming) {
              if (progressPercentage > 20) break
            }
            if (progressPercentage === 100) break

            await window.waitForTimeout(5000)
            continue
          }
        }
      }
      if (bt.isStreaming !== 1) {
        console.log('准备跳转到--上传中')
        await basePage.jumpPage('uploadingStatus')
        console.log('成功跳转')
        await homePage.searchBtn.click({ force: true })
        console.log('点击search按钮')
      }
      // 点击 Play 按钮
      if(! await homePage.getCardEle(bt.btName, 'playBtn').isVisible()){
        console.log('没有Play按钮')
        test.skip()
      }
      await homePage.getCardEle(bt.btName, 'playBtn').click({ timeout: 2 * 60000 })
      console.log('点击播放按钮')
      // 点击播放列表的第一个文件，跳转到player页面
      await homePage.firstFileBtn.click()
      console.log('点击播放列表的第一个文件，跳转到播放器页面')

      // should video can play
      await window.waitForTimeout(5000)
      const progressControl = await playerPage.stopPlay
      await playerPage.keyboardSpace
      await playerPage.playPage.click()
      await expect(progressControl).toBeVisible({ timeout: 30000 })
      await playerPage.stopPlay.click()
      // 是否删除种子
      if (bt.isDelete) {
        console.log('删除种子')
        await basePage.jumpPage('uploadingStatus')
        await homePage.getCardEle(bt.btName, 'deleteBtn').click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
      }
    })
  }
})
test.describe('task下载任务', () => {
  test.beforeEach(async ({ }, testInfo) => {
    if (process.platform === 'darwin') test.setTimeout(60000 * 8)
    else test.setTimeout(60000 * 5)
    await window.waitForTimeout(5000)
    await basePage.ensureLoginStatus(to, process.env.TEST_PASSWORD, 1)
    await window.waitForLoadState()
    await window.waitForTimeout(1000)
    await basePage.jumpPage('downloadedStatus')
    await homePage.searchBtn.click({ force: true })
    // 确保切换到卡片模式
    const cardMode = await homePage.toggleCardModeBtn
    if (await cardMode.isVisible()) {
      await cardMode.click()
    }
    await window.waitForLoadState()
    await window.waitForTimeout(2000)
    await homePage.uploadAllBtn.click()
    await window.waitForLoadState()
    await window.waitForTimeout(2000)
    await basePage.jumpPage('uploadingStatus')
    await homePage.searchBtn.click({ force: true })
    if (!testInfo.title.includes('delete')) {
      for (const bt of btData) {
        await homePage.getCard(bt.btName).waitFor({ timeout: 20000 })
      }
    }
  })
  test('card mode task list', async () => {
    await window.screenshot({ path: `${ScreenshotsPath}card-mode-taskStatus.png` })
    const cardMode = await homePage.toggleCardModeBtn
    if (await cardMode.isVisible()) {
      await cardMode.click()
    }
    const testBt = btData[0]
    // stop 功能
    await homePage.getCardEle(testBt.btName, 'stopBtn').click()
    await homePage.getCard(testBt.btName).waitFor('hidden')
    if (process.platform === 'darwin') await window.waitForTimeout(3000)
    await basePage.jumpPage('downloadedStatus')
    await window.waitForTimeout(3000)
    if (process.platform === 'darwin') await window.waitForTimeout(3000)
    await homePage.getCard(testBt.btName).waitFor('visible')
    await homePage.getCardEle(testBt.btName, 'seedBtn').click()
    await homePage.getCard(testBt.btName).waitFor('hidden')
    await basePage.jumpPage('uploadingStatus')
    await homePage.getCard(testBt.btName).waitFor('visible')
    // play 功能
    await homePage.getCardEle(testBt.btName, 'playBtn').click()
    await homePage.firstFileBtn.waitFor()
    // delete 功能
    await homePage.getCardEle(testBt.btName, 'deleteBtn').click()
    await homePage.deleteCard.waitFor()
    await homePage.deleteFileChk.waitFor()
    await homePage.notNowBtn.click()
    // more.. 功能
    await homePage.getCardEle(testBt.btName, 'moreBtn').click()
    await homePage.moreCard.waitFor()
    await window.waitForTimeout(1000)
    // 检查文件路径
    const filePathElement = await homePage.fileTreeBtn
    // 检查文件夹树状结构
    if (process.platform === 'darwin') await window.waitForTimeout(3000)
    await filePathElement.click()
    for (const file of testBt.folder) {
      await filePathElement.locator(`text=${file}`).waitFor()
    }
    await window.waitForTimeout(1000)
    // 退出卡片
    if (await homePage.moreCardCloseBtn.isVisible()){
      // 在小界面下卡片占据整个页面，卡片会有关闭按钮
      await homePage.moreCardCloseBtn.click()
    }
    await basePage.headerTitle.click({ force: true })
    try {
      await homePage.moreCard.waitFor('hidden')
    } catch {
      await basePage.headerTitle.click({ force: true })
    }
  })
  test('table mode task list', async () => {
    await window.screenshot({ path: `${ScreenshotsPath}table-mode-taskStatus.png` })
    // 切换列表模式
    const listMode = await homePage.toggleListModeBtn
    console.log('toggleListModeBtn', await listMode.isVisible())
    if (await listMode.isVisible()) {
      await listMode.click()
    }
    const testBt = btData[0]
    await window.waitForTimeout(1000)
    // 验证文件类型图标
    if (testBt.fileType === 'video_file') {
      const bbbFileIcon = await homePage.getListEle(testBt.btName, 'fileIcon').innerText()
      expect(bbbFileIcon).toBe('video_file')
    }
    const uTorrentFileIcon = await homePage.getListEle('uTorrent Web', 'fileIcon').innerText()
    expect(uTorrentFileIcon).toBe('folder')
    // 双击文件名播放文件
    await window.locator(`text=${testBt.btName}`).click({ clickCount: 2 })
    await playerPage.playSpeed.waitFor({ timeout: 10000 })
    await basePage.jumpPage('uploadingStatus')
    await window.waitForTimeout(1000)
    // 文件大小
    const fileSize = await homePage.getListEle(testBt.btName, 'fileSize').innerText()
    // expect(fileSize).toBe('56.07 MB')
    expect(/\d+\.\d+\s(MB|GB)/.test(fileSize)).toBe(true)
    // 完成时间格式 hh:mm:ss格式 非当日任务显示yesterday或yy-mm-dd格式
    expect(await homePage.getListEle(testBt.btName, 'completedTime')).toHaveText(/(\d{1,2}:\d{1,2}:\d{1,2}|Yesterday|\d{1,2}-\d{1,2}-\d{1,2})/)
    // 上传速度: (上传中) 单位KB/s或MB/s
    const uploadSpeed = await homePage.getListEle(testBt.btName, 'uploadSpeed').innerText()
    // console.log('uploadSpeed:' + uploadSpeed)
    expect(/(\d+(\.\d+)?\s?(KB|MB)?|-)/.test(uploadSpeed)).toBe(true)
    // 检查任务图标
    // stop 图标
    const stopIcon = await homePage.getListEle(testBt.btName, 'stopBtn')
    await stopIcon.waitFor()
    // file_open 图标
    const fileOpenIcon = await homePage.getListEle(testBt.btName, 'fileOpenBtn')
    await fileOpenIcon.waitFor()
    // // folder 图标
    // const fileIcon = await homePage.getListEle(btData[1].btName, 'folderBtn')
    // await fileIcon.waitFor()
    // more... 图标
    const moreIcon = await homePage.getListEle(testBt.btName, 'moreBtn')
    await moreIcon.waitFor()
    // close 图标
    const closeIcon = await homePage.getListEle(testBt.btName, 'closeBtn')
    await closeIcon.waitFor()
    await closeIcon.click()
    const isVisible = await homePage.deleteConfirm.isVisible()
    if (isVisible) {
      await homePage.deleteConfirm.click()
    }
    await homePage.deleteCard.waitFor({ timeout: 10000 })
    await homePage.notNowBtn.click()
    // 验证app协议链接
    if (process.platform !== 'darwin') {
      // "更多"功能检查Download url
      await moreIcon.click()
      await homePage.moreCard.waitFor()
      await window.waitForTimeout(1000)
      await homePage.copyUrlBtn.click()
      await homePage.copySuccessAlert.waitFor('visible')
      await basePage.waitForAllHidden(await homePage.copySuccessAlert)
      await basePage.headerTitle.click({ force: true })

      await window.keyboard.press(`${basePage.modifier}+KeyV`)
      const protocolRegExp = new RegExp(`${app.protocol}:\/\/`)
      const shortProtocolRegExp = new RegExp(`${app.shortProtocol}:\/\/`)
      expect(await homePage.magnetTarea).toHaveValue(protocolRegExp)
      await homePage.cardCancelBtn.click()

      await basePage.jumpPage('downloadingStatus')
      await homePage.downloadBtn.click()
      expect(await homePage.magnetTarea).toHaveValue(protocolRegExp)
      await homePage.cardCancelBtn.click()
      await basePage.jumpPage('uploadingStatus')
      await window.waitForTimeout(1000)
      // 验证分享短链接
      await moreIcon.click()
      await homePage.moreCard.waitFor()
      await window.waitForTimeout(1000)
      await homePage.copyShareUrlBtn.click()
      await homePage.copySuccessAlert.waitFor('visible')
      await basePage.headerTitle.click({ force: true })
      await window.keyboard.press(`${basePage.modifier}+KeyV`)
      expect(await homePage.magnetTarea).toHaveValue(shortProtocolRegExp)
      await homePage.cardCancelBtn.click()

      await basePage.jumpPage('downloadingStatus')
      await homePage.downloadBtn.click()
      expect(await homePage.magnetTarea).toHaveValue(shortProtocolRegExp)

      // 验证magnet链接
      await homePage.magnetTarea.fill('magnet:?xt=urn:btih:61b3b8856c4839edf51f5c2346599b6bec524145')
      // 复制磁链
      await window.focus('.q-card >> textarea')
      await window.keyboard.press(`${basePage.modifier}+KeyA`)
      await window.keyboard.press(`${basePage.modifier}+KeyC`)
      await homePage.cardCancelBtn.click()
      expect(await homePage.magnetTarea).toHaveCount(0, { timeout: 30000 })
      await window.waitForTimeout(2000)
      await window.keyboard.press(`${basePage.modifier}+KeyV`)
      expect(await homePage.magnetTarea).toHaveValue(/magnet:\?/)
      await homePage.cardCancelBtn.click()
      expect(await homePage.magnetTarea).toHaveCount(0, { timeout: 30000 })
      await window.waitForTimeout(2000)
      await homePage.downloadBtn.click()
      expect(await homePage.magnetTarea).toHaveValue(/magnet:\?/)
      await homePage.cardCancelBtn.click()

      await basePage.jumpPage('uploadingStatus')
      await window.waitForTimeout(1000)
    }
    // "更多"功能检查文件路径
    await moreIcon.click()
    await homePage.moreCard.waitFor()
    const filePathElement = await homePage.fileTreeBtn
    // 检查文件夹树状结构
    if (process.platform === 'darwin') await window.waitForTimeout(5000)
    await filePathElement.click()
    for (const file of testBt.folder) {
      await filePathElement.locator(`text=${file}`).waitFor()
    }
    await window.waitForTimeout(1000)
    // 退出卡片
    await basePage.headerTitle.click({ force: true })
    // downloaded状态栏
    await stopIcon.click()
    await stopIcon.waitFor('hidden')
    await window.waitForTimeout(3000)
    await basePage.jumpPage('downloadedStatus')
    await window.waitForTimeout(1000)
    const headerTitle = await basePage.headerTitle.innerText()
    if (!/Downloaded/.test(headerTitle)) await basePage.jumpPage('downloadedStatus')
    if (!testBt.isStreaming) {
      const btDataOne = await window.locator(`text=${testBt.btName}`)
      await btDataOne.waitFor('visible')
      // // 检查任务图标
      const uploadIcon = await homePage.getListEle(testBt.btName, 'seedBtn')
      await uploadIcon.waitFor()
      await window.waitForTimeout(2000)
      await uploadIcon.click()
      await btDataOne.waitFor('hidden')
      await basePage.jumpPage('uploadingStatus')
      await btDataOne.waitFor('visible')
    }
  })
  test('pause all', async () => {
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
    await window.waitForTimeout(2000)
    await homePage.upPauseAllBtn.click()
    await basePage.waitForAllHidden(await homePage.allCard, 60000)
    await basePage.jumpPage('downloadedStatus')
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
    await window.waitForTimeout(2000)
    await homePage.uploadAllBtn.click()
    await basePage.waitForAllHidden(await homePage.allCard, 60000)
    await basePage.jumpPage('uploadingStatus')
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
  })
  test('search task', async () => {
    await basePage.headerTitle.click()
    await homePage.searchBtn.click()
    const searchBt = 'bbb'
    await homePage.searchInput.fill(searchBt)
    await window.waitForTimeout(1000)
    for (const index in btData) {
      if (btData[index].isStreaming) continue
      if (btData[index].btName.includes(searchBt)) {
        await expect(homePage.getCard(btData[index].btName)).toBeVisible()
      } else {
        await expect(homePage.getCard(btData[index].btName)).toBeHidden()
      }
    }
    await homePage.searchCloseBtn.click()
    await window.waitForTimeout(1000)
    for (const bt of btData) {
      await homePage.getCard(bt.btName).waitFor('visible')
    }
  })
  test('repetitive task', async () => {
    await basePage.jumpPage('downloadingStatus')
    await homePage.searchBtn.click({ force: true })
    await homePage.downloadTorrent(btData[0].magnetLink, 1)
  })
  test('delete task', async () => {
    // const btName = [
    //   'uTorrent Web Tutorial Video',
    //   // 'The WIRED CD - Rip. Sample. Mash. Share',
    //   'sintel.mp4',
    //   'bbb_sunflower_1080p_30fps_normal.mp4'
    // ]
    for (const bt of btData) {
      if (bt.isStreaming) continue
      if (await homePage.getCard(bt.btName).isVisible()) {
        await homePage.getCardEle(bt.btName, 'deleteBtn').click()
        await homePage.deleteFileChk.click()
        await homePage.deleteBtn.click()
        await homePage.getCard(bt.btName).waitFor({ state: 'hidden', timeout: 30000 })
        // await expect(await homePage.getCard(bt)).toBeHidden()
      } else {
        console.log('[' + bt.btName + '] task has been deleted')
      }
    }
  })
})

test.describe('upload', () => {
  test('open upload card', async () => {
    await window.waitForTimeout(3000)
    await basePage.jumpPage('uploadingStatus')
    await window.waitForTimeout(2000)
    await homePage.searchBtn.click({ force: true })
    await homePage.uploadBtn.click()
    await homePage.uploadCard.waitFor()
    await homePage.ucCancelBtn.click()
    expect(await homePage.uploadCard).toHaveCount(0)
  })
  test.skip('test1', async () => {
    test.setTimeout(60000 * 15)
    const btName = 'ChinaCup.1080p.H264.AAC.mp4'
    const btAddress = path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4')
    // const oneFile = new File([''], btAddress, { path: btAddress })
    // const btCard = 'text=' + btName + ' >> xpath=..//..//..//..//.. >> '

    await basePage.jumpPage('homeLink')
    // Click button:has-text("Upload torrent")
    await window.click('button:has-text("Upload torrent")')

    console.log(path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4'))
    // await window.dispatchEvent('input[type="file"]', 'input', path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4'))
    // 1
    // const [fileChooser] = await Promise.all([
    //   window.waitForEvent('filechooser'),
    //   window.click('input[type="file"]')
    // ])
    // await fileChooser.setFiles(path.resolve(__dirname, '../cypress/fixtures/samples/ChinaCup.1080p.H264.AAC.mp4'))
    // 2
    fs.readFile(btAddress, async function read (err, data) {
      if (err) {
        throw err
      }
      console.log(data)
      await window.locator('input[type="file"]').setInputFiles({
        name: 'ChinaCup.1080p.H264.AAC.mp4',
        mimeType: 'video/mp4',
        buffer: data,
        path: btAddress,
        pathExt: 'btAddress'
      })
    })
    // 3
    // await window.locator('input[type="file"]').setInputFiles(btAddress)
    await window.waitForTimeout(1000)

    // const elementHandle = await window.$('input[type="file"]')
    // const props = await elementHandle.getProperties()
    // console.log('props:' + props)
    // console.log('1:' + props.has('files'))
    // await elementHandle.evaluate(node => node.setAttribute('files'))
    // await window.waitForTimeout(1000)

    await window.click(':nth-match(button:has-text("Upload"), 2)')
    await window.waitForTimeout(1000)
    await window.click('text=' + btName, { timeout: 5000 })
  })
})
