import { unstable_cache } from 'next/cache'
import { getCachedMySnippets } from '@app/_lib/data/mongo/snippet'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, languages, VERSION } from '@common/constants/helper'
import { Table } from '@app/snippet/snippet-table'
import { Suspense } from 'react'
import { getUser } from '@app/_lib/data/mongo/user'
import { notFound } from 'next/navigation'
import Input from '@common/components/forms/Input'
import Button from '@common/components/forms/Button'
import Select from '@common/components/forms/Select'

type Props = {
    page: number
    email: string
}

export async function PrivateServer({ page, email }: Props) {
    const userId = await getUser(email).then((user) => {
        if (!user) return undefined
        return user._id.toString()
    })
    if (!userId) {
        return notFound()
    }

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
