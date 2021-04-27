/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express from 'express'
import path from 'path'
import { Response } from 'express'

import { isDev } from 'src/server/utils/environment'

const staticRouter = express.Router()
const publicDir = path.resolve(__dirname, '../', '../', '../', '../', 'public')
const baseDirDev = path.resolve(__dirname, '../', '../', '../', '../', 'dist')
const baseDirProd = path.resolve(
    __dirname,
    '../',
    '../',
    '../',
    '../',
    'build',
    'frontend',
)

/**
 * Show react frontend
 * @param {Response} res
 * @return {void}
 */
export const showReact = (res: Response): void => {
    if (isDev()) {
        const html = `${baseDirDev}/index.html`
        res.sendFile(html)
    } else {
        const html = `${baseDirProd}/index.html`
        res.sendFile(html)
    }
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
