import {ElectronHandler} from "../../main/preload"
import {OperationMode, RobotPose, RobotState} from "../../main/main"

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        electron: ElectronHandler;
    }
}

export class API {
    static async close() {
        return window.electron.ipcRenderer.invoke("Close")
    }

    static async setEnabled(enabled: boolean) {
        return window.electron.ipcRenderer.invoke("SetEnabled", enabled)
    }

    static async setOpMode(opMode: OperationMode) {
        return window.electron.ipcRenderer.invoke("SetOpMode", opMode)
    }

    static registerPoseCallback(callback : (newPose : RobotPose) => void){
        window.electron.ipcRenderer.on("Pose", (event, args) => callback(args))
    }

    static registerRobotStateCallback(callback : (newPose : RobotState) => void){
        window.electron.ipcRenderer.on("RobotState", (event, args) => callback(args))
    }

    static unregisterRobotStateCallbacks(){
        window.electron.ipcRenderer.removeAllListeners("RobotState")
    }

    static sendControl(demand: {vl: number, w: number}){
        return window.electron.ipcRenderer.invoke("Control", demand)
    }
}