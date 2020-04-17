/** components/widgets/Tags */
import React from 'react';

interface Props {
  html: string;
}

export const TagCloud = (props: Props): JSX.Element => {
  return (
    <section
      className="widget tag-cloud"
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
};
