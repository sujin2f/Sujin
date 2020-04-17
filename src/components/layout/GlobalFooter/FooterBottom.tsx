/*
 * Global Footer Bottom Element Component
 * components/layout/GlobalFooter/FooterBottom
 */

import React from 'react';

import { Link } from "components/common/Link";
import { Menu } from 'components/layout/Menu';

export const FooterBottom = (): JSX.Element => {
  return (
    <div className="row">
      <div className="flex-row columns medium-6 small-12">
        <Link to="/" className="icon logo hide-for-small-only">Sujin</Link>
        <p>Copyright &copy; 2017 sujinc.com</p>
      </div>

      <Menu
        className="hide-for-small-only columns medium-6 small-12 menu__footer__social-media"
        slug="social-media"
      />
    </div>
  );
};
