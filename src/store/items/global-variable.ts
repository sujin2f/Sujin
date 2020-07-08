/* tslint:disable max-classes-per-file */
/** store/items/global-variable */

import {
  GlobalVariable as GlobalVariableType,
  RecentPostWidget,
  GoogleAdvertWidget,
  FlickrWidget,
  TagCloudWidget,
  WidgetTitle,
  WidgetType,
  WidgetKey,
  FlickrItems,
} from 'store/items/schema/global-variable';

class Widget {
  title: WidgetTitle
  widget: WidgetType
  key: WidgetKey

  constructor(data: any) {
    this.title = data.title
    this.widget = data.widget
    this.key = data.key
  }
}
class RecentPostWidgetClass extends Widget implements RecentPostWidget {
  /**
   * Small size column key
   */
  small: number
  /**
   * Medium size column key
   */
  medium: number
  /**
   * Large size column key
   */
  large: number

  constructor(data: any) {
    super(data)

    this.small = parseInt(data.small, 10)
    this.medium = parseInt(data.medium, 10)
    this.large = parseInt(data.large, 10)
  }
}
class GoogleAdvertWidgetClass extends Widget implements GoogleAdvertWidget {
  /**
   * Client value
   */
  client: string
  /**
   * Slot value
   */
  slot: string
  /**
   * Responsive Mode
   */
  responsive: boolean

  constructor(data: any) {
    super(data)

    this.client = data.client
    this.slot = data.slot
    this.responsive = !!data.responsive
  }
}
class FlickrWidgetClass extends Widget implements FlickrWidget {
  /**
   * Flickr Items
   */
  items: FlickrItems[]

  constructor(data: any) {
    super(data)

    this.items = data.items
  }
}
class TagCloudWidgetClass extends Widget implements TagCloudWidget {
  /**
   * Tag cloud HTML
   */
  html: string

  constructor(data: any) {
    super(data)

    this.html = data.html
  }
}

export type Widgets = RecentPostWidget | GoogleAdvertWidget | FlickrWidget | TagCloudWidget

export class GlobalVariable implements GlobalVariableType {
  /**
   * Site Title
   */
  title: string
  /**
   * Site Description
   */
  description: string
  /**
   * Site main page URL
   */
  url: string
  /**
   * Default thumbnail
   */
  thumbnail: string
  /**
   * Indicator whether header hidden on front page
   */
  hideFrontHeader: boolean
  /**
   * Indicator whether footer hidden on front page
   */
  hideFrontFooter: boolean
  /**
   * Frontpage post or page slug
   */
  frontPage: string
  /**
   * What shows on front page
   */
  showOnFront: 'post' | 'page'
  /**
   * Meta data
   */
  widgets: {
    /**
     * Siderail Widgets
     */
    siderail: (RecentPostWidget | GoogleAdvertWidget | FlickrWidget | TagCloudWidget)[]
    /**
     * Footer Widgets
     */
    footer: (RecentPostWidget | GoogleAdvertWidget | FlickrWidget | TagCloudWidget)[]
  }
  /**
   * Production indicator
   */
  isProd?: boolean

  private static instance: GlobalVariable;
  private constructor(data: any) {
    this.title = data.title
    this.description = data.description
    this.url = data.url
    this.thumbnail = data.thumbnail
    this.hideFrontHeader = !!data.hideFrontHeader
    this.hideFrontFooter = !!data.hideFrontFooter
    this.frontPage = data.frontPage
    this.showOnFront = data.showOnFront
    this.isProd = data.isProd

    const siderail = data.widgets && data.widgets.siderail
      ? this.getWidgetsArray(data.widgets.siderail)
      : []

    const footer = data.widgets && data.widgets.footer
      ? this.getWidgetsArray(data.widgets.footer)
      : []

    this.widgets = {
      siderail,
      footer,
    }
  }

  public static getInstance(data: any): GlobalVariable {
    if (!GlobalVariable.instance) {
      GlobalVariable.instance = new GlobalVariable(data);
    }

    return GlobalVariable.instance;
  }

  private getWidgetsArray(widgets: any) {
    return widgets.map((widget: any) => {
      switch (widget.widget) {
        case 'recent-post': {
          return new RecentPostWidgetClass(widget)
        }
        case 'google-advert': {
          return new GoogleAdvertWidgetClass(widget)
        }
        case 'flickr': {
          return new FlickrWidgetClass(widget)
        }
        case 'tag-cloud': {
          return new TagCloudWidgetClass(widget)
        }
      }

      return null
    }).filter((w: any) => w)
  }
}
/* tslint:enable max-classes-per-file */
