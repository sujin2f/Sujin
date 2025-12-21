import TopBar from '@app/@topbar/_components/TopBar'

export async function ShowMenu() {
    return <TopBar menu="primary" showMenu={true} />
}

export async function HideMenu() {
    return <TopBar menu="primary" />
}
