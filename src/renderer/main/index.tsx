import {createRoot} from 'react-dom/client'
import App from './App'
import {CssBaseline, ThemeProvider} from "@mui/material"
import theme from "../common/theme"


const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
        <ThemeProvider theme={theme}>
                <CssBaseline/>
                <App/>
        </ThemeProvider>
)

