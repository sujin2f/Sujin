/**
 * Static pages endpoint
 */

/* istanbul ignore file */
import express, { Request } from 'express'
import path from 'path'

import { TermTypes } from '@project/types/wordpress'
import { archive } from '@utils/endpoints/archive'
import { post } from '@utils/endpoints/post'
import { DEV_TOOL_SEO } from '@constants/menu-devtool'
import { rootDir } from '@common/utils/path'
import {
    publicParam,
    assetParam,
    GetTemplateVar,
    showReact,
} from '@common/utils/server-route'

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
            type = TermTypes.tag
        }
        slug = regexExec[2]
    }

    // archive with page
    regex = new RegExp(/\/(category|tag)\/([a-z0-9-_]+)\/page\/([0-9]+)$/)
    regexExec = regex.exec(req.url)
    if (regexExec) {
        if (regexExec[1] === 'tag') {
            type = TermTypes.tag
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

const getGlobalVariable: GetTemplateVar<GlobalVars> = async (req: Request) => {
    const [title, excerpt, image] = await getTitleExcerpt(req)

    const globalVariable: GlobalVars = {
        SITE_NAME: process.env.TITLE || '',
        TITLE: title,
        DESCRIPTION: excerpt,
        EXCERPT: process.env.EXCERPT || '',
        IMAGE: image,
        URL: `${process.env.FRONTEND}${req.url}`,
        FRONTEND: process.env.FRONTEND || '',
        GOOGLE_AD_CLIENT: process.env.GOOGLE_AD_CLIENT || '',
        GOOGLE_AD_SLOT: process.env.GOOGLE_AD_SLOT || '',
        FLICKR_ID: process.env.FLICKR_ID || '',
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
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
