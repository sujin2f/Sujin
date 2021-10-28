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
import { cached } from '../utils/node-cache'

const staticRouter = express.Router()

const getGlobalVariable = async (): Promise<GlobalVariable> => {
    const cache = cached.get<GlobalVariable>('global-variable')
    if (cache) {
        return cache
    }

    const frontend = new URL((await getOption<string>('home')) || '')
    const backend = new URL((await getOption<string>('siteurl')) || '')

    const globalVariable: GlobalVariable = {
        title: (await getOption('blogname')) || '',
        description: (await getOption('blogdescription')) || '',
        frontend: 'https://devfront.sujinc.com' || frontend.origin,
        backend: '' || backend.origin,
    }

    cached.set<GlobalVariable>('global-variable', globalVariable)
    return globalVariable
}

/**
 * Show react frontend
 *
 * @param {Response} res
 * @return {void}
 */
export const showReact = async (res: Response): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const filePath = path.resolve(publicDir, 'frontend.html')

    const globalVariable = await getGlobalVariable()
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

/**
 * React frontend
 */
staticRouter.use(function (_, res) {
    showReact(res)
})

export { staticRouter }
