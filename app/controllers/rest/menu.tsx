import MenuItem from 'app/types/rest/menu';
import RestController from 'app/controllers/rest/base';
import { RestItemBuilder } from 'app/types/rest/base';

/*
 * Menu Controller
 */
export default class MenuController extends RestController<MenuItem> {
  public static instance: {
    [slug: string]: MenuController;
  } = {};
  private readonly slug: string;

  protected constructor(itemBuilder: RestItemBuilder<MenuItem>, slug: string) {
    super(itemBuilder);
    this.slug = slug;
  }

  /*
   * Get multiton object
   */
  public static getInstance(slug: string): MenuController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController(MenuItem, slug);
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
