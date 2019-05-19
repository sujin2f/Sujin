import React, { Component } from 'react';
import PageHeader from 'app/components/layout/PageHeader';

const { Fragment } = wp.element;

class Archive extends Component {
  render() {
    return (
      <section className="page-wrapper">
        <PageHeader
          backgroundImage=""
        >
          <Fragment>
            <h1>SUJIN</h1>
            <p>Wordpress/React Developer</p>
          </Fragment>
        </PageHeader>

        Archive
      </section>
    );
  }
}

export default Archive;
