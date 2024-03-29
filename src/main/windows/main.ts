import {BrowserWindow} from "electron"

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const createMainWindow = (): BrowserWindow => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        show: false,
        resizable: true,
        frame: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    })

    mainWindow.menuBarVisible = false

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    mainWindow.on("ready-to-show", () => {
        mainWindow.show()
    })


    return mainWindow
}

export default createMainWindow