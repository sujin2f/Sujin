import { STORE } from 'app/constants/common';

const { Fragment, Component } = wp.element;
const { withSelect } = wp.data;
const { compose } = wp.compose;

class NoMatch extends Component {
  render() {
    console.log('NoMatch::render()');
    const {
      matched,
      children,
    } = this.props;

    if (Object.keys(matched).length) {
      return null;
    }

    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  matched: select(STORE).getMatched(),
}));

export default compose([mapStateToProps])(NoMatch);
