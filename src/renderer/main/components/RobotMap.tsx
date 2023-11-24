import Sketch from "react-p5"
import p5Types from "p5"
import {RobotPose} from "../../../main/main"
import {useTheme} from "@mui/material"

const hexToRgb = (hex: string) =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

let size = {width: 0, height: 0}
const lightenOffsetBackground = 20

let robotPose : RobotPose = {X: 0, Y: 0, Theta: 0}
let robotPoseHistory: {Pose: RobotPose, Timestamp: Date}[] = []
const robotPoseHistoryTTL = 1 // Seconds
let setupCallback = false

const robotPoseCallback = (pose: RobotPose) => {
    robotPoseHistory = robotPoseHistory.filter(value => {
        const t = (Date.now()-value.Timestamp.getTime()) / 1000.0
        return robotPoseHistoryTTL > t
    })

    robotPoseHistory.push({Pose: robotPose, Timestamp: new Date()})

    robotPose = pose
}


function getSizePrecise(size = '1em', parent = document.body) {
    let l = document.createElement('div'), i = 1, s, t
    l.style.visibility = 'hidden'
    l.style.boxSizing = 'content-box'
    l.style.position = 'absolute'
    l.style.maxHeight = 'none'
    l.style.height = size
    parent.appendChild(l)
    t = l.clientHeight
    do {
        s = t
        i *= 10
        l.style.height = 'calc(' + i + '*' + size + ')'
        t = l.clientHeight
    } while(t !== s * 10)
    l.remove()
    return t / i
}


export const RobotMap = (props: {registerRobotPoseCallback: (cb: (pose: RobotPose) => void) => void}) => {
    const theme = useTheme()
    const backgroundColor = hexToRgb(theme.palette.background.paper)

    const sizing = getSizePrecise("0.5em")

    const getSketchSize = (sketchElement : HTMLElement) => {
        return {width: sketchElement.offsetWidth, height: sketchElement.offsetHeight}
    }
    const setup = (p5: p5Types) => {
        const sketch = document.getElementById("sketch")
        size = getSketchSize(sketch)
        p5.createCanvas(size.width, size.height).parent(sketch)
        p5.angleMode(p5.DEGREES)
        p5.frameRate(240)

        if(!setupCallback){
            setupCallback = true
            props.registerRobotPoseCallback(robotPoseCallback)
        }
    }


    const drawRobot = (p5 : p5Types) => {
        p5.push()
        const headingRads = (robotPose.Theta)
        p5.applyMatrix(Math.cos(headingRads),Math.sin(headingRads),-Math.sin(headingRads),Math.cos(headingRads), robotPose.X * sizing, robotPose.Y * sizing)
        p5.strokeWeight(1)
        p5.stroke(`#fffff`)

        p5.beginShape()
        p5.vertex(0 -   12, -0)
        p5.vertex(-5 -  12, -15)
        p5.vertex(30 -  12, 0)
        p5.vertex(-5 -  12, 15)
        p5.vertex(0 -   12, 0)
        p5.endShape()
        p5.pop()
    }

    const drawRobotTrail = (p5 : p5Types) => {
        p5.push()

        p5.noStroke()
        robotPoseHistory.forEach((record) => {
            const t = (Date.now()-record.Timestamp.getTime()) / 1000.0

            p5.fill(255, 255, 255, (1 - t/robotPoseHistoryTTL) * 255)
            p5.circle(record.Pose.X * sizing, record.Pose.Y * sizing, 3)
        })

        p5.pop()
    }

    const draw = (p5: p5Types) => {
        p5.background(backgroundColor[0] + lightenOffsetBackground, backgroundColor[1] + lightenOffsetBackground, backgroundColor[2] + lightenOffsetBackground)
        p5.applyMatrix(Math.cos( -Math.PI / 2),Math.sin( -Math.PI / 2),-Math.sin( -Math.PI / 2),Math.cos( Math.PI / 2), size.width / 2, size.height / 2)
        p5.scale(1, -1)

        drawRobotTrail(p5)
        drawRobot(p5)
    }

    return (
        <Sketch setup={setup} draw={draw} />
    )
}