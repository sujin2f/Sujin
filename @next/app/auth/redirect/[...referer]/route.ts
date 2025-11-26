import type { NextRequest } from 'next/server'
/* Utils */
import { setCookies } from '@lib/utils/server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

export async function GET(request: NextRequest) {
    Logger.info('🤟 login redirected!')
    await setCookies()

    const url = new URL(request.url)
    const pathname = url.pathname.replace('/auth/redirect', '')
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}${pathname === '/root' ? '/' : pathname}`)
}
