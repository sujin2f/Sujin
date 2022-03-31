/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express, { Response, Request } from 'express'
import path from 'path'
import ejs from 'ejs'
import { pathToRegexp } from 'path-to-regexp'

import { GlobalVariable, TermTypes } from 'src/types'
import { CacheKeys } from 'src/constants'
import { bundles, publicDir, baseDir, cached } from 'src/utils'
import { getPost } from 'src/utils/mysql/get-posts-by'
import { getTermBy } from 'src/utils/mysql/get-term-by'

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

const getTitleExcerpt = async (
    req: Request,
): Promise<[string, string, string]> => {
    const defaultTitle = process.env.TITLE || ''
    const defaultValue: [string, string, string] = [
        defaultTitle,
        process.env.EXCERPT || '',
        '/thumbnail.png',
    ]

    const regexPost = pathToRegexp(
        '/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug',
        [],
    )
    const execPost = regexPost.exec(req.url) || []
    const regexPage = pathToRegexp('/:slug', [])
    const execPage = regexPage.exec(req.url) || []
    const postSlug = execPost[4] || execPage[1]
    if (postSlug) {
        return await getPost(postSlug)
            .then((response) => {
                return [
                    `${defaultTitle} - ${response.title}`,
                    response.excerpt,
                    response.images.thumbnail?.url || '/thumbnail.png',
                ] as [string, string, string]
            })
            .catch(() => {
                return defaultValue
            })
    }

    const regexArchive = pathToRegexp('/:type/:slug', [])
    const execArchive = regexArchive.exec(req.url) || []
    const regexArchiveWithPage = pathToRegexp('/:type/:slug/page/:page?', [])
    const execArchiveWithPage = regexArchiveWithPage.exec(req.url) || []
    const type = execArchive[1] || execArchiveWithPage[1]
    const slug = execArchive[2] || execArchiveWithPage[2]
    if (type === 'category') {
        return await getTermBy(TermTypes.category, slug, 1)
            .then((response) => {
                return [
                    `${defaultTitle} - ${response.title}`,
                    response.excerpt,
                    response.image?.url || '/thumbnail.png',
                ] as [string, string, string]
            })
            .catch(() => {
                return defaultValue
            })
    }

    return defaultValue
}

const getGlobalVariable = async (req: Request): Promise<GlobalVariable> => {
    const cache = cached.get<GlobalVariable>(CacheKeys.GLOBAL_VARS)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    const [title, excerpt, image] = await getTitleExcerpt(req)

    const globalVariable: GlobalVariable = {
        title,
        excerpt,
        image,
        url: `${process.env.FRONTEND}${req.url}`,
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
 * @param {Request} req
 * @param {Response} res
 * @return {void}
 */
export const showReact = async (req: Request, res: Response): Promise<void> => {
    const filePath = path.resolve(publicDir, 'frontend.ejs')
    const bundleData = bundles()
    const globalVariable = await getGlobalVariable(req).catch((e) =>
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
staticRouter.use((req, res) => {
    showReact(req, res)
})

export { staticRouter }
