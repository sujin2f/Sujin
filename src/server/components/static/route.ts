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
import { TGlobalVariable } from 'src/types/common'

const staticRouter = express.Router()

/**
 * Show react frontend
 * @param {Response} res
 * @return {void}
 */
export const showReact = async (res: Response): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const filePath = path.resolve(publicDir, 'frontend.html')

    const globalVariable: TGlobalVariable = {
        frontend: process.env.FRONTEND || '',
        backend: process.env.BACKEND || '',
        prod: !isDev(),
    }
    const html = await ejs.renderFile(filePath, {
        globalVariable,
        bundles: [...bundles()],
    })

    res.send(html)
}

/**
 * React frontend
 */
staticRouter.get('/', (_, res) => {
    showReact(res)
})

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

/**
 * Not found
 */
staticRouter.use(function (_, res) {
    showReact(res)
})

export { staticRouter }
