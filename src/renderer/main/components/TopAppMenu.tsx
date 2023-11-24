import {API} from "../../common/api"
import {Box, IconButton, Typography} from "@mui/material"
import {Close} from "@mui/icons-material"

export const TopAppMenu = () => {
    const onClose = () => {
        API.close()
    }

    return <Box sx={{display: "flex", width: "100%"}}>
        <IconButton size="small" disableRipple onClick={onClose} sx={{marginLeft: "auto", marginTop: 0,  marginRight: 0, WebkitAppRegion: "no-drag"}}>
            <Close/>
        </IconButton>
    </Box>
}