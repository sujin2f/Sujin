import { STORE } from 'app/constants/common';

const { Component } = wp.element;
const { withSelect } = wp.data;
const { compose } = wp.compose;

class NoMatch extends Component {
  render() {
    const {
      matched,
    } = this.props;

    if (Object.keys(matched).length) {
      return null;
    }

    return (
      <div>
        404 Not Found
      </div>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  matched: select(STORE).getMatched(),
}));

export default compose([mapStateToProps])(NoMatch);
