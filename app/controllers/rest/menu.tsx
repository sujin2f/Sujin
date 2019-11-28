/**  app/controllers/rest/menu */

// Controller
import {
  RestController,
  IRestController,
  IRestItemBuilder,
} from 'app/controllers/rest';

// Item
import Menu from 'app/items/rest/menu';
import { IMenu } from 'app/items/rest/interface/menu';

/*
 * Menu Controller
 */
export default class MenuController extends RestController<IMenu> {
  public static instance: {
    [slug: string]: MenuController;
  } = {};
  private readonly slug: string;

  protected constructor(itemBuilder: IRestItemBuilder<IMenu>, slug: string) {
    super(itemBuilder);
    this.slug = slug;
  }

  /*
   * Get multiton object
   */
  public static getInstance(slug: string): IRestController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController(Menu, slug);
    }
    return MenuController.instance[slug];
  }

  public addComponent(component: ReactComponent): IRestController {
    this.components.push(component);
    this.components = Array.from(new Set(this.components));
    return this;
  }

  protected forceUpdate(): void {
    this.components.forEach((component) => component.forceUpdate());
  }

  protected getRestUrl(): string {
    return `/wp-json/sujin/v1/menu/${this.slug}`;
  }
}
