import { type PropsWithChildren } from 'react'

export default async function SingleLayout({ children }: PropsWithChildren) {
    return <main className="container mx-auto">{children}</main>
}
