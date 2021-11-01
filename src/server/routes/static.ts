/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express, { Response } from 'express'
import path from 'path'
import ejs from 'ejs'

import { GlobalVariable } from 'src/types'
import { CacheKeys } from 'src/constants'
import {
    bundles,
    isDev,
    publicDir,
    baseDirDev,
    baseDirProd,
    cached,
    getOption,
} from 'src/utils'

const staticRouter = express.Router()

const getGlobalVariable = async (): Promise<GlobalVariable> => {
    const cache = cached.get<GlobalVariable>(CacheKeys.GLOBAL_VARS)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    const home = await getOption<string>('home').catch((e) => console.error(e))
    const siteurl = await getOption<string>('siteurl').catch((e) =>
        console.error(e),
    )
    const frontend = home ? new URL(home).origin : ''
    const backend = siteurl ? new URL(siteurl).origin : ''
    const title = await getOption<string>('blogname').catch((e) =>
        console.error(e),
    )
    const excerpt = await getOption<string>('blogdescription').catch((e) =>
        console.error(e),
    )

    const globalVariable: GlobalVariable = {
        title: title || '',
        excerpt: excerpt || '',
        frontend: isDev() ? 'http://localhost:3000' : frontend,
        backend: backend,
        flickrId: process.env.FLICKR_ID,
        adClient: process.env.GOOGLE_AD_CLIENT,
        adSlot: process.env.GOOGLE_AD_SLOT,
    }

    cached.set<GlobalVariable>(CacheKeys.GLOBAL_VARS, globalVariable)
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

    const globalVariable = await getGlobalVariable().catch((e) =>
        console.error(e),
    )
    const html = await ejs
        .renderFile(filePath, {
            globalVariable,
            bundles: [...bundles()],
        })
        .catch((e) => console.error(e))

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
