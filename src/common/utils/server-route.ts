/* istanbul ignore file */
import { Response, Request } from 'express'
import path from 'path'
import ejs from 'ejs'
import { bundles, publicDir, baseDir, isDev } from './path'

/**
 * Public Dir
 */
export const publicParam: [
    RegExp | RegExp[],
    (req: Request, res: Response) => void,
] = [
    [
        /(robots\.txt|favicon\.png|favicon-16x16\.png|favicon-32x32\.png|thumbnail\.png)$/,
        /service-worker\.js/,
    ],
    (req, res) => {
        const url = new URL(`http://dummy.com${req.path}`)
        res.sendFile(path.join(publicDir, url.pathname))
    },
]

export const assetParam: [RegExp, (req: Request, res: Response) => void] = [
    /\.js|\.map|\.json|\.png|\.svg|\.css$/,
    (req, res) => {
        if (isDev) {
            const matched = req.url.match(/\/[0-9.]+\/(.+)/)
            const url = matched ? `/${matched[1]}` : req.url
            res.sendFile(`${baseDir}/frontend${url}`)
            return
        }

        res.sendFile(`${baseDir}/frontend${req.url}`)
    },
]

export type GetTemplateVar<T> = (req: Request) => Promise<T>

/**
 * Show react frontend
 */

export const showReact = async <T>(
    req: Request,
    res: Response,
    getTemplateVar: GetTemplateVar<T>,
): Promise<void> => {
    const filePath = path.resolve(publicDir, 'index.ejs')
    const bundleData = bundles()
    const vars = await getTemplateVar(req)
    const html = await ejs
        .renderFile(filePath, {
            ...vars,
            JS: Object.keys(bundleData)
                .filter((value) => (value as string).endsWith('.js'))
                .reduce((acc, cur) => {
                    return {
                        ...acc,
                        [cur]: bundleData[cur],
                    }
                }, {}),
            CSS: Object.keys(bundleData)
                .filter((value) => (value as string).endsWith('.css'))
                .reduce((acc, cur) => {
                    return {
                        ...acc,
                        [cur]: bundleData[cur],
                    }
                }, {}),
        })
        .catch((e) => console.error(e))
    res.send(html)
}
