'use client'
import TopBar from '@app/@topbar/_components/TopBar'

export function ShowMenu() {
    return <TopBar menu="primary" showMenu={true} />
}

export function HideMenu() {
    return <TopBar menu="primary" />
}
