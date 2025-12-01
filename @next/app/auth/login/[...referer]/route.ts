import { NextRequest } from 'next/server'
/* Utils */
import { createLoginToken } from '@lib/utils/server/header'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

const getLoginURL = async (request: NextRequest) => {
    const url = new URL(request.url)
    const redirect = `${process.env.BASE_URL}/auth/redirect/${url.pathname.replace('/auth/login/', '')}`
    const token = await createLoginToken(redirect)
    return `${process.env.AUTH_ENDPOINT}/google/auth?token=${token}`
}

export async function GET(request: NextRequest) {
    Logger.info('🤞 login started!')
    return Response.redirect(await getLoginURL(request))
}
