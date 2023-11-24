import {
    Backdrop,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem, Paper,
    Select,
    SelectChangeEvent,
    styled,
    Typography
} from "@mui/material"
import {OperationMode, RobotState} from "../../../main/main"

const OperationModeButton = styled(Button)`
    flex: 1;
`

export const RobotStateDisplayAndControl = (props: {robotState: RobotState, onEnabledChange: (enabled: boolean) => void, onOperationModeChange: (event: SelectChangeEvent<OperationMode>) => void}) => {

    return <Box sx={{display: "flex", position: "relative", width: "100%", height: "100%"}}>
        <Backdrop
            sx={{position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.95)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!props.robotState.Connected}>
            <Typography>Robot no conectado</Typography>
        </Backdrop>

        <Box sx={{display: "flex", flexDirection: "column", height: "100%", width: "20%"}}>
            <OperationModeButton onClick={() => props.onEnabledChange(true)} disabled={props.robotState.Enabled} color="success">
                <Typography>Activar</Typography>
            </OperationModeButton>
            <OperationModeButton onClick={() => props.onEnabledChange(false)} disabled={!props.robotState.Enabled} color="error">
                <Typography>Desactivar</Typography>
            </OperationModeButton>
        </Box>

        <Box sx={{width: "20%", marginY: "auto", paddingX: "0.5em"}}>
            <FormControl fullWidth>
                <InputLabel id="operation-mode-select-label">Modo de operación</InputLabel>
                <Select
                    labelId="operation-mode-select-label"
                    id="operation-mode-select"
                    value={props.robotState.OperationMode}
                    label="Modo de operación"
                    onChange={props.onOperationModeChange}
                >
                    <MenuItem value={"Teleop"}>Teleoperado</MenuItem>
                    <MenuItem value={"Autonomo"}>Autónomo</MenuItem>
                </Select>
            </FormControl>
        </Box>

        <Paper sx={{flex: 1, marginLeft: "0.5em", minHeight: 0, marginY: "0.25em", padding: "0.25em", overflowY: "auto", "*": {overflowAnchor: "none"}}} elevation={1}>
            {props.robotState.Messages.map((message, index) => {
                return <Box key={`robot-state-display-msgs-${index}`}>
                    <Typography variant="body1">{message}</Typography>
                </Box>
            })}
            <Box sx={{height: "1px", overflowAnchor: "auto"}}/>
        </Paper>
    </Box>
}