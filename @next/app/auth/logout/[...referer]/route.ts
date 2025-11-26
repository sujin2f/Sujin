import { NextRequest } from 'next/server'
/* Utils */
import { getUserInfo, logout } from '@lib/utils/server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

const redirect = (url: URL) => {
    const pathname = url.pathname.replace('/auth/logout', '')
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}${pathname === '/root' ? '/' : pathname}`)
}

export async function GET(request: NextRequest) {
    const user = await getUserInfo()
    if (!user) {
        return redirect(new URL(request.url))
    }
    Logger.info(`🤟 logout started!: ${user.email}`)
    await logout()
    return redirect(new URL(request.url))
}
