// TODO animation https://codepen.io/ramon82/pen/opJXGr

import Menu from 'app/components/layout/Menu';
import Loading from 'app/components/layout/Loading';

const { Component } = wp.element;

class PageHeader extends Component {
  render() {
    const {
      prefix,
      title,
      description,
      backgroundImage,
      backgroundColor,
      useBackgroundColor,
      isLoading,
    } = this.props;

    let content = null;
    let style = {};

    if (isLoading) {
      content = (<Loading />);
    } else {
      style = {
        backgroundImage:
          typeof backgroundImage !== 'string' && !(backgroundImage instanceof String) ?
            null :
            `url(${backgroundImage})`,
        backgroundSize: useBackgroundColor ? 'contain' : 'cover',
        backgroundColor: backgroundColor || null,
      };

      content = (
        <div className="text row">
          <div className="columns small-12">
            <h1>
              {prefix && (<span>{prefix}</span>)}
              {title}
            </h1>
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      );
    }

    return (
      <header
        className="page-header-wrapper"
        style={style}
      >
        <div className="overlay">
          {content}

          <div className="row menu-container">
            <section className="columns small-12">
              <Menu
                id="primany-page-header"
                className="show-for-large flex-row"
                slug="main-menu"
              />
            </section>
          </div>
        </div>
      </header>
    );
  }
}

export default PageHeader;
