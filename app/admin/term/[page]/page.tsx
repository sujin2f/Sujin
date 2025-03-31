import TermsTable from '@components/admin/TermsTable'
import { mongoIdToString } from '@common/utils/object'
import Link from 'next/link'
import getTerm from '@src/db/mongo/admin/getTerm'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function AdminTerm(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const terms = await getTerm(page)
    return (
        <>
            <TermsTable terms={mongoIdToString(...terms)} />
            <nav>
                <ul>
                    {page !== 1 && (
                        <li>
                            <Link href={`/admin/term/${page - 1}`}>Prev</Link>
                        </li>
                    )}
                    <li>
                        <Link href={`/admin/term/${page + 1}`}>Next</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}
