import { NextRequest } from 'next/server'
/* Utils */
import { createLoginToken } from '@app/_lib/utils/tokens'
/* Models */
import { Logger } from '@common/model/Logger'

const getLoginURL = async (request: NextRequest) => {
    const url = new URL(request.url)
    const redirect = `${process.env.NEXT_BASE_URL}/auth/redirect/${url.pathname.replace('/auth/login/', '')}`
    const token = await createLoginToken(redirect)

    return `${process.env.AUTH_BASE_URL}/google/auth?token=${token}`
}

export async function GET(request: NextRequest) {
    Logger.info('login started!', process.env.AUTH_BASE_URL)
    return Response.redirect(await getLoginURL(request))
}
