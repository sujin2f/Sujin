import type { NextRequest } from 'next/server'
/* Utils */
import { setCookies } from '@app/_lib/utils/tokens'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

export async function GET(request: NextRequest) {
    Logger.info('🤞 login redirected!')
    const url = new URL(request.url)
    await setCookies(`${url.searchParams.get('token')}`).catch((e) => {
        Logger.error(`Parsing cookie failed ${JSON.stringify(e)}`)
    })

    const pathname = url.pathname.replace('/auth/redirect', '')
    return Response.redirect(`${process.env.NEXT_BASE_URL}${pathname === '/root' ? '/' : pathname}`)
}
