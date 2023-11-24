import {app, BrowserWindow, ipcMain} from 'electron'
import createMainWindow from "./windows/main"
import ReconnectingWebSocket from 'reconnecting-websocket'
import WS from 'ws'



let mainWindow: BrowserWindow = null

export type OperationMode = "Autonomous" | "Teleop"

export type RobotPose = { X: number, Y: number, Theta: number } // cms, cms, degrees

export type RobotState = {
    Enabled: boolean,
    Connected: boolean,
    Pose: RobotPose
    OperationMode: OperationMode,
    Messages: string[]
}

const lastRobotState: RobotState = {
    Enabled: false,
    Connected: false,
    Pose: {X: 0, Y: 0, Theta: 0},
    OperationMode: "Teleop",
    Messages: []
}

const options = {
    WebSocket: WS,
    connectionTimeout: 1000
}

const robotConnection = new ReconnectingWebSocket('ws://10.42.0.1:5000', [], options)

const addMessage = (msg: string) => {
    console.log(msg)
    if (lastRobotState.Messages.length >= 100) {
        lastRobotState.Messages.splice(0, 1)
    }

    lastRobotState.Messages.push(`${(new Date()).toLocaleTimeString()}: ${msg}`)
}

app.on('ready', async () => {
    mainWindow = createMainWindow()

    setupWebSocket()
    updateRobotState()
    requestPose()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

/// IPC
ipcMain.handle('Close', async () => {
    if (mainWindow !== null && mainWindow !== undefined) {
        mainWindow.close()
        mainWindow = null
    }
})

ipcMain.handle('SetEnabled', async (event, enabled) => {
    if (robotConnection !== null && lastRobotState.Connected) {
        robotConnection.send(`enabled:${enabled}`)
    }
})

ipcMain.handle('SetOpMode', async (event, mode) => {
    if (robotConnection !== null && lastRobotState.Connected) {
        robotConnection.send(`opmode:${mode}`)
    }
})

ipcMain.handle('Control', async (event, control) => {
    if (robotConnection !== null && lastRobotState.Connected) {
        robotConnection.send(`control:${control.vl}, ${control.w}`)
    }
})

const setupWebSocket = () => {
    /// Websocket
    lastRobotState.Enabled = false
    lastRobotState.Connected = false

    robotConnection.addEventListener("error", event => {
        lastRobotState.Enabled = false
        lastRobotState.Connected = false
        addMessage(event.error.toString())
    })

    robotConnection.addEventListener("close", event => {
        lastRobotState.Enabled = false
        lastRobotState.Connected = false
        addMessage(`Robot disconnected: ${event.code}`)
    })

    robotConnection.addEventListener("open", event => {
        lastRobotState.Enabled = false
        lastRobotState.Connected = true
        addMessage(`Robot connected`)
    })

    robotConnection.addEventListener("message", event => {
        const res : string = event.data
        const coords = res.split(",")
        lastRobotState.Pose = {X: parseFloat(coords[0]), Y: parseFloat(coords[1]), Theta: parseFloat(coords[2])}
        mainWindow.webContents.send("Pose", lastRobotState.Pose)
    })

}

const updateRobotState = async () => {
    while (true) {
        if (mainWindow !== null) {
            mainWindow.webContents.send("RobotState", lastRobotState)
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }
}

const requestPose = async () => {
    while (true) {
        robotConnection.send("pose")
        await new Promise(resolve => setTimeout(resolve, 20))
    }
}