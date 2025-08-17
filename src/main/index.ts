import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 定义小说数据接口
interface NovelData {
  id: number
  title: string
  author: string
  description: string
  status: string
  cover?: string
  lastRead?: Date
  origin?: string
  bookUrl?: string
  durChapterIndex?: number
}

function createWindow(): void {
  // Create the browser window with tablet-friendly dimensions and no frame.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 创建小说阅读窗口
function createReaderWindow(novelData: NovelData): void {
  const readerWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    frame: true, // 保持窗口边框，方便用户操作
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 在页面加载前清除可能存在的旧数据
  readerWindow.webContents.session
    .clearStorageData({
      storages: ['localstorage']
    })
    .then(() => {
      // 将小说数据传递给新窗口
      const novelDataString = JSON.stringify(novelData)
      readerWindow.webContents.executeJavaScript(`
      localStorage.setItem('selectedNovel', ${JSON.stringify(novelDataString)});
    `).catch((error) => {
        console.error('执行JavaScript设置小说数据时出错:', error)
      })
    })
    .catch((error) => {
      console.error('清除存储数据时出错:', error)
      // 如果清除失败，仍然尝试设置数据
      const novelDataString = JSON.stringify(novelData)
      readerWindow.webContents.executeJavaScript(`
      localStorage.setItem('selectedNovel', ${JSON.stringify(novelDataString)});
    `).catch((error) => {
        console.error('执行JavaScript设置小说数据时出错:', error)
      })
    })

  readerWindow.on('ready-to-show', () => {
    readerWindow.show()
  })

  // 加载阅读器页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    readerWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/reader`)
  } else {
    readerWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '#/reader' })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Handle window close request
  ipcMain.on('close-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.close()
    }
  })

  // Handle create reader window request
  ipcMain.on('create-reader-window', (event, novelData) => {
    createReaderWindow(novelData)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.