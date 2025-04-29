import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import { ObjectId } from 'mongodb'
/* Models */
import { ForbiddenError } from '@common/model/Error'
/* Components */
import { LoadingTable } from '@app/_components/LoadingTable'
import { Paging } from '@app/_components/Paging'
import { ListClient } from '@app/recipe/_components/List.client'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Button from '@common/components/forms/Button'
/* Utils */
import { getCachedRecipes } from '@app/recipe/_lib/getCachedRecipes'
import { getCurrentUser } from '@app/_lib/data/mongo/user'
import { deleteRecipe } from '@app/recipe/_lib/deleteRecipe'
import { A_Error } from '@common/model/Error'
import type { T_SessionUser } from '@app/_lib/types'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'

type Props = {
    page: number
    userId?: ObjectId
    title?: string
}

export async function ListServer({ title = 'Recipes', page, userId }: Props) {
    const user = await getCurrentUser().catch(() => undefined)
    const mine = !!userId
    if (mine && !user) {
        throw new ForbiddenError('You must log-in for this service.').log()
    }

    const request = unstable_cache(
        async (page: number, userId?: ObjectId) =>
            await getCachedRecipes(page, userId).catch(() => ({
                list: [],
                pages: 0,
            })),
        [page.toString(), userId ? userId.toString() : '', VERSION],
        {
            tags: ['recipe', 'list'],
            revalidate,
        },
    )

    return (
        <>
            <h2>{title}</h2>
            {user && (
                <Row fullWidth className="--gap__bottom">
                    <Column large={6}>
                        {!userId ? (
                            <Button href="/recipe/mine/1" title="My Recipes" />
                        ) : (
                            <Button href="/recipe/1" title="Public Recipes" />
                        )}
                    </Column>
                    <Column className="--right" large={6}>
                        <Button
                            href="/recipe/mutate/new"
                            title="Add a New Recipe"
                        />
                    </Column>
                </Row>
            )}

            <Suspense fallback={<LoadingTable />}>
                <ListRequest
                    page={page}
                    mine={mine && user}
                    request={request(page, userId)}
                />
            </Suspense>
        </>
    )
}

type PropsListRequest = {
    readonly page: number
    readonly mine?: T_SessionUser | false
    readonly request: ReturnType<typeof getCachedRecipes>
}

async function ListRequest({ page, mine, request }: PropsListRequest) {
    const { list, pages } = await request

    const remove = async (id: string) => {
        'use server'
        await deleteRecipe(new ObjectId(id)).catch((e) => {
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        })
    }

    return (
        <>
            <ListClient list={list} mine={mine} remove={remove} />
            <Paging
                pages={pages}
                page={page}
                urlPrefix={`/recipe/${mine ? 'mine' : ''}`}
            />
        </>
    )
}
