import MenuItem from 'app/types/rest/menu';
import RestController from 'app/controllers/rest/base';

/*
 * Menu Controller
 */
export default class MenuController extends RestController<MenuItem> {
  static instance: {
    [slug: string]: MenuController;
  } = {};
  private readonly slug: string;

  constructor(itemBuilder, slug: string) {
    super(itemBuilder);
    this.slug = slug;
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

  /*
   * Get multiton object
   */
  static getInstance(slug: string): MenuController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController(MenuItem, slug);
    }
    return MenuController.instance[slug];
  }
}
