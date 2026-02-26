import { type NextRequest, NextResponse } from 'next/server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { getTokenFromHeader } from '@sujin/lib/utils/token'

export const getToken = (request: NextRequest): string | NextResponse => {
    const token = getTokenFromHeader(request.headers)
    if (!token) {
        Logger.error('Focus cloud message PUT failed: Token does not exist.')
        return NextResponse.json({ error: 'Token does not exist. Please check your login status.' }, { status: 401 }) // 401 Unauthorized
    }
    return token
}
