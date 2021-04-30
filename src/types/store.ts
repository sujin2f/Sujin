import { MenuItem } from './wp'

export type ActionLoadMenuSuccess = {
    type: string
    slug: string
    menuItems: MenuItem[]
}
