/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express, { Response, Request } from 'express'
import path from 'path'
import ejs from 'ejs'

import { GlobalVariable } from 'src/types/common'
import { TermTypes } from 'src/types/wordpress'
import { archive } from 'src/utils/endpoints/archive'
import { post } from 'src/utils/endpoints/post'
import { DEV_TOOL_SEO } from 'src/constants/menu-devtool'
import {
    publicParam,
    assetParam,
    showReact,
    GetGlobalVariable,
} from 'src/common/utils/server-route'

const { baseDir, rootDir } = require('src/common/utils/path')
const staticRouter = express.Router()

/**
 * WP content
 */
staticRouter.get('/wp-content(/*)', (req, res) => {
    const html = path.join(
        rootDir,
        'wordpress',
        req.url.replace('wp-content', ''),
    )
    res.sendFile(html)
})

// Sitemap - Use XML Sitemap Generator for WordPress
staticRouter.get(/^\/sitemap.+/, (req, res) => {
    console.log(`🤩 Sitemap Accessed ${req.url}`)
    res.redirect(301, `${process.env.WORDPRESS}${req.url}`)
})

staticRouter.get(/\/feed\/$/, (req, res) => {
    res.redirect(301, `${process.env.WORDPRESS}${req.url}`)
})

/**
 * Assets
 */
staticRouter.get(publicParam[0], publicParam[1])
staticRouter.get(assetParam[0], assetParam[1])

const getTitleExcerpt = async (
    req: Request,
): Promise<[string, string, string]> => {
    const defaultTitle = process.env.TITLE || ''
    const defaultValue: [string, string, string] = [
        defaultTitle,
        process.env.EXCERPT || '',
        '/thumbnail.png',
    ]
    if (req.url === '/') {
        return defaultValue
    }

    if (req.url.indexOf('/dev-tools/') !== 1) {
        if (DEV_TOOL_SEO[req.url]) {
            return [
                DEV_TOOL_SEO[req.url].seoTitle,
                DEV_TOOL_SEO[req.url].seoDescription,
                '/thumbnail.png',
            ]
        }
    }

    let slug = ''
    let type = TermTypes.category

    // archive
    let regex = new RegExp(/\/(category|tag)\/(.+)$/)
    let regexExec = regex.exec(req.url)
    if (regexExec) {
        if (regexExec[1] === 'tag') {
            type = TermTypes.post_tag
        }
        slug = regexExec[2]
    }

    // archive with page
    regex = new RegExp(/\/(category|tag)\/([a-z0-9-_]+)\/page\/([0-9]+)$/)
    regexExec = regex.exec(req.url)
    if (regexExec) {
        if (regexExec[1] === 'tag') {
            type = TermTypes.post_tag
        }
        slug = regexExec[2]
    }

    if (slug) {
        return await archive({ type, slug, page: 1 })
            .then((response) => {
                if (response) {
                    return [
                        `${defaultTitle} - ${response.title}`,
                        response.excerpt,
                        response.image?.url ||
                            `${process.env.FRONTEND}/thumbnail.png`,
                    ] as [string, string, string]
                }

                // TODO: 404
                return defaultValue
            })
            .catch(() => defaultValue)
    }

    // post type
    regex = new RegExp(/\/\d{4}\/[0-9]+\/[0-9]+\/(.+)$/)
    regexExec = regex.exec(req.url)
    if (regexExec) {
        slug = regexExec[1]
    }
    // page type
    regex = new RegExp(/\/([0-9a-z-_]+)$/)
    regexExec = regex.exec(req.url)
    if (regexExec) {
        slug = regexExec[1]
    }

    if (slug) {
        return await post({ slug })
            .then((response) => {
                if (response) {
                    return [
                        `${defaultTitle} - ${response.title}`,
                        response.excerpt,
                        response.images.thumbnail?.url ||
                            `${process.env.FRONTEND}/thumbnail.png`,
                    ] as [string, string, string]
                }
                // TODO: 404
                return defaultValue
            })
            .catch(() => defaultValue)
    }

    return defaultValue
}

const getGlobalVariable: GetGlobalVariable<GlobalVariable> = async (req) => {
    const [title, excerpt, image] = await getTitleExcerpt(req)

    const globalVariable: GlobalVariable = {
        siteName: process.env.TITLE,
        title,
        excerpt,
        image,
        url: `${process.env.FRONTEND}${req.url}`,
        frontend: process.env.FRONTEND,
        adClient: process.env.GOOGLE_AD_CLIENT,
        adSlot: process.env.GOOGLE_AD_SLOT,
        flickrId: process.env.FLICKR_ID,
        isProd: process.env.NODE_ENV === 'production',
    }

    return globalVariable
}

/**
 * React frontend
 */
staticRouter.use((req, res) => {
    showReact(req, res, getGlobalVariable)
})

export { staticRouter }
