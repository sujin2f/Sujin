import { RestItemBuilder } from 'app/types/rest/base';
import Menu from 'app/items/rest/menu';
import RestController from 'app/controllers/rest/base';

/*
 * Menu Controller
 */
export default class MenuController extends RestController<Menu> {
  public static instance: {
    [slug: string]: MenuController;
  } = {};
  private readonly slug: string;

  protected constructor(itemBuilder: RestItemBuilder<Menu>, slug: string) {
    super(itemBuilder);
    this.slug = slug;
  }

  /*
   * Get multiton object
   */
  public static getInstance(slug: string): MenuController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController(Menu, slug);
    }
    return MenuController.instance[slug];
  }

  public addComponent(component: ReactComponent): MenuController {
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
