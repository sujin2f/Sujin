import type { NextRequest } from 'next/server'
/* Models */
import { PUT as itemPUT, DELETE as itemDELETE } from '@app/focus/item/route'

/**
 * @deprecated Backward compatibility
 */
export async function PUT(request: NextRequest) {
    return itemPUT(request)
}

/**
 * @deprecated Backward compatibility
 */
export async function DELETE(request: NextRequest) {
    return itemDELETE(request)
}
