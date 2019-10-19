import MenuItem from 'app/types/rest/menu';
import RestController from 'app/controllers/rest/base';

/*
 * Menu Controller
 */
export default class MenuController extends RestController<MenuItem> {
  static instance: {
    [slug: string]: MenuController;
  } = {};

  /*
   * Get multiton object
   */
  static getInstance(slug: string): MenuController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController(MenuItem);
      MenuController.instance[slug].restUrl = `/wp-json/sujin/v1/menu/${slug}`;
    }
    return MenuController.instance[slug];
  }
}
