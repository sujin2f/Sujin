import resetIndex from '@src/db/mongo/admin/resetIndex'
import { redirect } from 'next/navigation'

export default async function ResetIndex() {
    await resetIndex('post', 'spectra', 'term', 'options', 'user')
    redirect('/admin')
}
