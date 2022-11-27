/* istanbul ignore file */
import express, { Response, Request } from 'express'
import path from 'path'
import ejs from 'ejs'

import { GlobalVariable } from 'src/types/common'
import { TermTypes } from 'src/types/wordpress'
import { bundles, publicDir, baseDir, rootDir } from 'src/utils/environment'
import { archive } from 'src/utils/endpoints/archive'
import { post } from 'src/utils/endpoints/post'

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

/**
 * Sitemap
 * Use XML Sitemap Generator for WordPress
 */
staticRouter.get(/^\/sitemap.+/, (req, res) => {
    console.log(`🤩 Sitemap Accessed ${req.url}`)
    res.redirect(301, `${process.env.WORDPRESS}${req.url}`)
})

staticRouter.get(/\/feed\/$/, (req, res) => {
    res.redirect(301, `${process.env.WORDPRESS}${req.url}`)
})

/**
 * Public Dir
 */
staticRouter.get(
    /robots\.txt|manifest\.json|favicon\.png|favicon-16x16\.png|favicon-32x32\.png|thumbnail\.png$/,
    (req, res) => {
        const html = `${publicDir}${req.url}`
        res.sendFile(html)
    },
)

/**
 * Static Dir
 */
staticRouter.get('/static(/*)', (req, res) => {
    res.sendFile(`${baseDir}/frontend${req.url}`)
})

type DefaultValue = {
    title: string
    excerpt: string
    image: string
    is404: boolean
}

const getTitleExcerpt = async (req: Request): Promise<DefaultValue> => {
    const defaultValue = {
        title: process.env.TITLE || '',
        excerpt: process.env.EXCERPT || '',
        image: `${process.env.FRONTEND}/thumbnail.png`,
        is404: true,
    }
    if (req.url === '/') {
        return {
            ...defaultValue,
            is404: false,
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
                    return {
                        title: `${defaultValue.title} - ${response.title}`,
                        excerpt: response.excerpt,
                        image:
                            response.image?.url ||
                            `${process.env.FRONTEND}/thumbnail.png`,
                        is404: false,
                    }
                }

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
                    return {
                        title: `${defaultValue.title} - ${response.title}`,
                        excerpt: response.excerpt,
                        image:
                            response.images.thumbnail?.url ||
                            `${process.env.FRONTEND}/thumbnail.png`,
                        is404: false,
                    }
                }

                return defaultValue
            })
            .catch(() => defaultValue)
    }

    return defaultValue
}

const getGlobalVariable = async (req: Request): Promise<GlobalVariable> => {
    const { title, excerpt, image, is404 } = await getTitleExcerpt(req)

    return {
        siteName: process.env.TITLE,
        title,
        excerpt,
        image,
        url: `${process.env.FRONTEND}${req.url}`,
        frontend: process.env.FRONTEND,
        adClient: process.env.GOOGLE_AD_CLIENT,
        adSlot: process.env.GOOGLE_AD_SLOT,
        isProd: process.env.NODE_ENV === 'production',
        is404,
    }
}

/**
 * Show react frontend
 */
export const showReact = async (req: Request, res: Response): Promise<void> => {
    const filePath = path.resolve(publicDir, 'frontend.ejs')
    const bundleData = bundles()
    const globalVariable = await getGlobalVariable(req)
    const html = await ejs
        .renderFile(filePath, {
            ...globalVariable,
            js: bundleData.filter((value) => value.endsWith('.js')),
            css: bundleData.filter((value) => value.endsWith('.css')),
        })
        .catch((e) => console.error(e))

    if (globalVariable.is404) {
        res.statusCode = 404
    }
    res.send(html)
}

/**
 * React frontend
 */
staticRouter.use((req, res) => {
    showReact(req, res)
})

export { staticRouter }
