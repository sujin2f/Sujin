import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import { setTitle } from 'app/utils/common';

const { Component } = wp.element;

class NotFound extends Component {
  render() {
    setTitle('Not Found');
    return (
      <Public className="stretched-background hide-footer template-404">
        <PageHeader>
          <h1>SUJIN</h1>
          <p>Not Found</p>
        </PageHeader>
      </Public>
    );
  }
}

export default NotFound;
