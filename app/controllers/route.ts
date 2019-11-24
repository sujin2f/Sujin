/*
 * Route Controller
 *
 * Matched and history controller
 */

import pathToRegexp from 'path-to-regexp';
import { createBrowserHistory, History } from 'history';

import GlobalController from 'app/controllers/global';
import MatchedItem, { IMatchedItem, emptyMatched } from 'app/items/matched';

// TODO I don't want to add any react dependant modules
import { scrollTo } from 'app/utils/common';

export default class RouteController {
  private static instance: RouteController;
  private readonly history: History = createBrowserHistory();
  private matched: IMatchedItem = emptyMatched;
  private component: ReactComponent;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private constructor(component?: ReactComponent) {
    if (component) {
      this.component = component;
    }

    this.history.listen((location, action: string) => {
      if (action === 'PUSH' || action === 'POP') {
        scrollTo();
        GlobalController.getInstance().setMobileMenu(false);
        this.setMatched();
        if (this.component) {
          this.component.forceUpdate();
        }
      }
    });
  }
  /* eslint-enable */

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public static getInstance(component?: ReactComponent): RouteController {
    if (!this.instance) {
      this.instance = new RouteController(component);
    }

    return this.instance;
  }
  /* eslint-enable */

  public getHistory(): History {
    return this.history;
  }

  public setMatched(matched?: IMatchedItem): void {
    if (matched) {
      this.matched = matched;
      return;
    }

    this.matched = emptyMatched;
  }

  public getMatched(): IMatchedItem {
    return this.matched || emptyMatched;
  }

  /*
   * From the path, make MatchedItem.
   * TODO check the path has never changed
   */
  public parseMatched(path: string): IMatchedItem {
    if (!path) {
      return new MatchedItem({});
    }

    const regExp = new RegExp(pathToRegexp(path));
    const matchedResult = regExp.exec(this.history.location.pathname);
    const pathname = path.split('/')
      .filter((p) => p.charAt(0) === ':')
      .map((p) => p.slice(1).replace(/\?|(\(.+\))/, ''));

    const matched = matchedResult && pathname.reduce((acc, value, index) => ({
      ...acc,
      [value]: matchedResult[index + 1],
    }), { matched: true });

    return new MatchedItem(matched || {});
  }

  /*
   * User pushed a link. We are gonna move to the other place! Yea!
   */
  public pushHash(e, href: string, target: string = ''): void {
    // New Window
    if (target === '_blank') {
      return;
    }

    // Go!
    this.history.push(href.replace(window.location.origin, ''));
    e.preventDefault();
  }

  public filterChild(children): Array<JSX.Element> {
    let validChild = null;

    children.some((child) => {
      const parsed: IMatchedItem = this.parseMatched(child.props.path);

      // Not Matched -- maybe the next one
      if (!parsed.matched) {
        return false;
      }

      // Not Matched (404)
      if (!child.props.path) {
        validChild = child;
        return true;
      }

      // matched was not yet set
      if (!this.matched.matched) {
        this.setMatched(parsed);
      }

      validChild = child;
      validChild.props = {
        ...validChild.props,
        componentHash: this.history.location.key,
      };
      return true;
    });

    return [validChild];
  }
}
