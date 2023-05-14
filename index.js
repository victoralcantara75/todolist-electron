const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 800,
    resizable: false
  })

  win.loadFile('./src/index.html')
}

app.whenReady().then(() => {
  createWindow()
})