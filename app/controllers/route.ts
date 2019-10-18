import pathToRegexp from 'path-to-regexp';
import { createBrowserHistory, History } from 'history';

import GlobalController from 'app/controllers/global';
import MatchedItem, { emptyMatched } from 'app/types/matched';
import { scrollTo } from 'app/utils/common';

export default class RouteController {
  static instance: RouteController;
  private matched: MatchedItem;
  public history;

  static getInstance(): RouteController {
    if (!this.instance) {
      this.instance = new RouteController();
      this.instance.history = createBrowserHistory();

      this.instance.history.listen((location, action: string) => {
        if (action === 'PUSH' || action === 'POP') {
          scrollTo();
          GlobalController.getInstance().setMobileMenu(false);
          this.instance.setMatched();
        }
      });
    }

    return this.instance;
  }

  public getHistory(): History {
    return this.history;
  }

  public setMatched(matched?: MatchedItem): void {
    if (matched) {
      this.matched = matched;
      return;
    }
    this.matched = emptyMatched;
  }

  public getMatched(): MatchedItem {
    return this.matched || emptyMatched;
  }

  public parseMatched(path: string): MatchedItem {
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
}
