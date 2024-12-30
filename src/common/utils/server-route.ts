/* istanbul ignore file */
import { Response, Request } from 'express'
import path from 'path'
import ejs from 'ejs'

const { bundles, publicDir, baseDir } = require('src/common/utils/path')

/**
 * Public Dir
 */
export const publicParam: [RegExp, (req: Request, res: Response) => void] = [
    /robots\.txt|manifest\.json|favicon\.png|favicon-16x16\.png|favicon-32x32\.png|thumbnail\.png|service-worker\.js$/,
    (req, res) => {
        const html = `${publicDir}${req.url}`
        res.sendFile(html)
    },
]

export type GetGlobalVariable<T> = (req: Request) => Promise<T>
type ShowReac<T> = (
    req: Request,
    res: Response,
    getGlobalVariable: GetGlobalVariable<T>,
) => Promise<void>

/**
 * Show react frontend
 */

export const showReact = async <T>(
    req: Request,
    res: Response,
    getGlobalVariable: GetGlobalVariable<T>,
): Promise<void> => {
    const filePath = path.resolve(publicDir, 'frontend.ejs')
    const bundleData = bundles()
    const globalVariable = await getGlobalVariable(req)
    const html = await ejs
        .renderFile(filePath, {
            ...globalVariable,
            js: Object.values(bundleData).filter((value) =>
                (value as string).endsWith('.js'),
            ),
            css: Object.values(bundleData).filter((value) =>
                (value as string).endsWith('.css'),
            ),
        })
        .catch((e) => console.error(e))
    res.send(html)
}
