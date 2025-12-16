export type MenuItem = {
    position: string
    id: number
    title: string
    target?: string
    link: string
    className?: string
    children?: MenuItem[]
    order: number
    parent?: number
}
