/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express, { Response } from 'express'
import path from 'path'
import ejs from 'ejs'

import {
    bundles,
    isDev,
    publicDir,
    baseDirDev,
    baseDirProd,
} from 'src/server/utils/environment'
import { GlobalVariable } from 'src/types/common'
import { getOption } from 'src/server/utils/mysql'

const staticRouter = express.Router()

/**
 * Show react frontend
 *
 * @param {Response} res
 * @return {void}
 */
export const showReact = async (res: Response): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const filePath = path.resolve(publicDir, 'frontend.html')

    const globalVariable: GlobalVariable = {
        title: (await getOption('blogname')) || '',
        description: (await getOption('blogdescription')) || '',
        frontend: (await getOption('home')) || '',
        backend: (await getOption('siteurl')) || '',
        prod: !isDev(),
    }
    const html = await ejs.renderFile(filePath, {
        globalVariable,
        bundles: [...bundles()],
    })

    res.send(html)
}

/**
 * Assets
 */
staticRouter.get('/assets(/*)', (req, res) => {
    const html = `${publicDir}/${req.url}`
    res.sendFile(html)
})

staticRouter.get('/robots.txt', (_, res) => {
    const html = `${publicDir}/robots.txt`
    res.sendFile(html)
})

staticRouter.get('/static(/*)', (req, res) => {
    if (isDev()) {
        const html = `${baseDirDev}${req.url}`
        res.sendFile(html)
    } else {
        const html = `${baseDirProd}${req.url}`
        res.sendFile(html)
    }
})

staticRouter.get('/', (_, res) => {
    showReact(res)
})

/**
 * React frontend
 */
// staticRouter.use(function (_, res) {
//     console.log('showReact')
//     showReact(res)
// })

export { staticRouter }
