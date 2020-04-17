/*
 * Public Wrapper Component
 * scenes/public
 */

import React from 'react';

import { GlobalFooter } from 'components/layout/GlobalFooter';
import { FixedHeader } from 'components/layout/GlobalHeader/FixedHeader';
import { TopHeader } from 'components/layout/GlobalHeader/TopHeader';
import { usePublicClassName } from 'store/hooks/global';

import 'assets/styles/style.scss';

interface Props {
  children?: JSX.Element[]|JSX.Element;
}

export const Public = (props: Props): JSX.Element => {
  const [className, wrapperElement] = usePublicClassName();

  return (
    <div ref={wrapperElement} className={className}>
      <header itemType="http://schema.org/WPHeader">
        <FixedHeader />
        <TopHeader />
      </header>

      <main className="row">
        {props.children}
      </main>

      <footer itemType="https://schema.org/WPFooter">
        <GlobalFooter />
      </footer>
    </div>
  );
};
