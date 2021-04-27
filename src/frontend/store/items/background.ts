/** store/items/background */

import { Background as BackgroundType } from 'src/frontend/store/items/schema/background'

export class Background implements BackgroundType {
    desktop: string
    mobile: string
    title: string

    constructor(data: any) {
        this.desktop = data.desktop
        this.mobile = data.mobile
        this.title = data.title
    }
}
