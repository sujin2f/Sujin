import { type PropsWithChildren } from 'react'

export default async function SingleLayout({ children }: PropsWithChildren) {
    console.log('SingleLayout')
    return <main className="container mx-auto">{children}</main>
}
