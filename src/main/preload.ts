// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {contextBridge, ipcRenderer} from 'electron'

export type Channels =
    'Close'
    | 'Pose'
    | 'RobotState'
    | 'SetEnabled'
    | 'SetOpMode'
    | 'Control'

const electronHandler = {
    ipcRenderer: {
        invoke(channel: Channels, ...args: any[]): Promise<any> {
            return ipcRenderer.invoke(channel, ...args)
        },
        on(channel : Channels, callback: (...args: any[]) => void ) : void {
            ipcRenderer.on(channel, callback)
        },
        removeAllListeners(channel : Channels) : void {
            ipcRenderer.removeAllListeners(channel)
        }
    },
}

contextBridge.exposeInMainWorld('electron', electronHandler)

export type ElectronHandler = typeof electronHandler;
