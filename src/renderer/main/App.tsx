import {
    Box,
    SelectChangeEvent,
    Typography
} from "@mui/material"

import {OperationMode, RobotState} from "../../main/main"
import {useEffect, useLayoutEffect, useState} from "react"
import {RobotStateDisplayAndControl} from "./components/RobotStateDisplayAndControl"
import {TopAppMenu} from "./components/TopAppMenu"
import {RobotMap} from "./components/RobotMap"
import {API} from "../common/api"

window.addEventListener("gamepadconnected", (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
    )
})


setInterval(() => {


    const gamepads = navigator.getGamepads();

    if(gamepads.length === 0 || gamepads[0] === null){
        return
    }

    const vl = -gamepads[0].axes[1]
    const w = -gamepads[0].axes[2]
    API.sendControl({vl: vl, w: w})
}, 16)

export default function App() {
    const [robotState, setRobotState] = useState<RobotState>({OperationMode: "Teleop", Enabled: false, Pose: {X: 0, Y: 0, Theta: 0}, Connected: false, Messages: []})
    const [showMap, setShowMap] = useState(false)

    useEffect(() => {
        setShowMap(true)
        API.registerRobotStateCallback(onRobotStateChanged)

        return () => {
            API.unregisterRobotStateCallbacks()
        }
    }, [])

    useLayoutEffect(() => {
        const  updateSize =  () => {
            setShowMap(false)
            const wait = new Promise(resolve => setTimeout(resolve, 100))
            wait.then(() => {
                setShowMap(true)
            })
        }
        window.addEventListener('resize', updateSize);
        updateSize()
        return () => window.removeEventListener('resize', updateSize);
    }, [])

    const onOperationModeChange = (event : SelectChangeEvent<OperationMode>) => {
        // @ts-ignore
        API.setOpMode(event.target.value)
    }

    const onEnabledChange = (enabled : boolean) => {
        API.setEnabled(enabled)
    }

    const onRobotStateChanged = (robotState : RobotState) => {
        setRobotState(robotState)
    }

    return  <Box sx={{display: "flex", position: "absolute", flexDirection: "column", width: "100%", height: "100%", WebkitAppRegion: "drag"}}>
                <TopAppMenu/>
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", maxWidth: "60em", height: "100%", marginX: "auto", padding: "0em", marginBottom: "2em", WebkitAppRegion: "no-drag"}}>
                    <Typography sx={{marginBottom: "0.5em"}} variant={"h6"}>Proyecto Final Embebidos</Typography>
                    <Box id={"sketch"} sx={{flex: 1, display: "flex"}}>
                        {showMap ?  <RobotMap registerRobotPoseCallback={API.registerPoseCallback} /> : <></>}
                    </Box>
                    <Box sx={{display: "flex", height: "10em", paddingTop: "0.5em"}}>
                        <RobotStateDisplayAndControl robotState={robotState} onOperationModeChange={onOperationModeChange} onEnabledChange={onEnabledChange}/>
                    </Box>
                </Box>
            </Box>
}
