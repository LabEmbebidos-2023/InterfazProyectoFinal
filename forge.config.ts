import type {ForgeConfig} from '@electron-forge/shared-types'
import {MakerZIP} from '@electron-forge/maker-zip'
import {MakerDeb} from '@electron-forge/maker-deb'
import {MakerRpm} from '@electron-forge/maker-rpm'
import {AutoUnpackNativesPlugin} from '@electron-forge/plugin-auto-unpack-natives'
import {WebpackPlugin} from '@electron-forge/plugin-webpack'

import {mainConfig} from './webpack.main.config'
import {rendererConfig} from './webpack.renderer.config'
import MakerSquirrel from "@electron-forge/maker-squirrel"

const config: ForgeConfig = {
    packagerConfig: {
        asar: true
    },
    rebuildConfig: {},
    makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' static: http: https: ws: ; script-src 'self' 'unsafe-eval';",
            mainConfig,
            renderer: {
                config: rendererConfig,
            entryPoints: [
                    {
                        html: './src/renderer/main/index.html',
                        js: './src/renderer/main/index.tsx',
                        name: 'main_window',
                        preload: {
                            js: './src/main/preload.ts',
                        }
                    }
                ],
            },
        }),
    ],
}

export default config



