/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express, { Response } from 'express'
import path from 'path'
import ejs from 'ejs'

import { GlobalVariable } from 'src/types'
import { CacheKeys } from 'src/constants'
import { bundles, publicDir, baseDir, cached } from 'src/utils'

const staticRouter = express.Router()

/**
 * Assets
 */
staticRouter.get(
    /robots\.txt|manifest\.json|favicon\.png|favicon-16x16\.png|favicon-32x32\.png|thumbnail\.png$/,
    (req, res) => {
        const html = `${publicDir}${req.url}`
        res.sendFile(html)
    },
)

staticRouter.get('/static(/*)', (req, res) => {
    res.sendFile(`${baseDir}/frontend${req.url}`)
})

const getGlobalVariable = async (): Promise<GlobalVariable> => {
    const cache = cached.get<GlobalVariable>(CacheKeys.GLOBAL_VARS)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    // TODO Title and excerpt from WP
    const globalVariable: GlobalVariable = {
        title: process.env.TITLE,
        excerpt: process.env.EXCERPT,
        frontend: process.env.FRONTEND,
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
    const filePath = path.resolve(publicDir, 'frontend.ejs')
    const bundleData = bundles()
    const globalVariable = await getGlobalVariable().catch((e) =>
        console.error(e),
    )
    const html = await ejs
        .renderFile(filePath, {
            ...globalVariable,
            js: bundleData.filter((value) => value.endsWith('.js')),
            css: bundleData.filter((value) => value.endsWith('.css')),
        })
        .catch((e) => console.error(e))

    res.send(html)
}

/**
 * React frontend
 */
staticRouter.use((_, res) => {
    showReact(res)
})

export { staticRouter }
