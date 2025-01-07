/* istanbul ignore file */
import { Response, Request } from 'express'
import path from 'path'
import ejs from 'ejs'
import { bundles, publicDir, baseDir } from './path'

/**
 * Public Dir
 */
export const publicParam: [RegExp, (req: Request, res: Response) => void] = [
    /robots\.txt|favicon\.png|favicon-16x16\.png|favicon-32x32\.png|thumbnail\.png|service-worker\.js$/,
    (req, res) => {
        const html = `${publicDir}${req.url}`
        res.sendFile(html)
    },
]

export const assetParam: [RegExp, (req: Request, res: Response) => void] = [
    /\.js|\.map|\.json|\.png|\.svg|\.css$/,
    (req, res) => {
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
    const vars = {
        ...(await getTemplateVar(req)),
        isProd: process.env.NODE_ENV === 'production',
    }
    const jsObj = Object.keys(bundleData)
        .filter((value) => (value as string).endsWith('.js'))
        .reduce((acc, cur) => {
            return {
                ...acc,
                [cur]: bundleData[cur],
            }
        }, {})
    const cssObj = Object.keys(bundleData)
        .filter((value) => (value as string).endsWith('.css'))
        .reduce((acc, cur) => {
            return {
                ...acc,
                [cur]: bundleData[cur],
            }
        }, {})
    const html = await ejs
        .renderFile(filePath, {
            ...vars,
            js: Object.values(bundleData).filter((value) =>
                (value as string).endsWith('.js'),
            ),
            css: Object.values(bundleData).filter((value) =>
                (value as string).endsWith('.css'),
            ),
            jsObj,
            cssObj,
        })
        .catch((e) => console.error(e))
    res.send(html)
}
