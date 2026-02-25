import type { NextRequest } from 'next/server'
/* Models */
import { GET as itemsGET } from '@app/focus/items/route'

/**
 * @deprecated Backward compatibility
 */
export async function GET(request: NextRequest) {
    return itemsGET(request)
}
