import { NextRequest } from 'next/server'
/* Utils */
import { getUserInfo, logout } from '@app/_lib/utils/tokens'
import { promiseLike } from '@common/utils/helper'
/* Models */
import { Logger } from '@common/model/Logger'

const redirect = (url: URL | string) => {
    if (typeof url === 'string') {
        return Response.redirect(url)
    }
    const pathname = url.pathname.replace('/auth/logout', '')
    return Response.redirect(`${process.env.NEXT_BASE_URL}${pathname === '/root' ? '/' : pathname}`)
}

export async function GET(request: NextRequest) {
    const user = await getUserInfo().catch(() => undefined)
    const url = await promiseLike(() => new URL(request.url)).catch(() => {
        Logger.error(`Cannot parse the URL: ${request.url}`)
        return `${process.env.AUTH_BASE_URL}`
    })
    if (!user) {
        return redirect(url)
    }
    Logger.info(`logout started!: ${user.email}`)
    await logout()
    return redirect(url)
}
