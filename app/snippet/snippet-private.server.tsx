import { unstable_cache } from 'next/cache'
import { getCachedMySnippets } from '@app/_lib/data/mongo/snippet'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, languages, VERSION } from '@common/constants/helper'
import { Table } from '@app/snippet/snippet-table'
import { Suspense } from 'react'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import { notFound } from 'next/navigation'
import Input from '@common/components/forms/Input'
import Button from '@common/components/forms/Button'
import Select from '@common/components/forms/Select'

type Props = {
    page: number
}

export async function PrivateServer({ page }: Props) {
    const userId = await getCurrentUser()
        .then((user) => user._id)
        .catch(() => notFound())

    const request = unstable_cache(
        async (page) => await getCachedMySnippets(userId, page),
        [page.toString(), VERSION],
        {
            tags: ['snippet', 'common'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const options: Record<string, string> = { '': 'Select Language' }

    languages.forEach((lang) => {
        options[lang] = lang
    })

    return (
        <>
            <h2>Insert Snippet</h2>
            <Input placeholder="Tags" />
            <Select options={options} />
            <Input type="textarea" placeholder="Insert your snippet here" />
            <Button>Submit</Button>

            <h2>My Snippets</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <Table
                    request={request(page)}
                    page={page}
                    userId={userId}
                    columns={['title', 'tags']}
                />
            </Suspense>
        </>
    )
}
