'use client'
import Wrapper from '@lib/components/Wrapper'
import style from '@app/front-page.module.scss'

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
    reset?: () => void
}) {
    const title = error.name !== 'Error' ? error.name : 'Something went wrong'
    return <Wrapper title={title} excerpt={error?.message} style={style} />
}
