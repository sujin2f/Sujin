import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/Public';

const { Component } = wp.element;

class NotFound extends Component {
  render() {
    return (
      <Public className="stretched-background hide-footer">
        <PageHeader>
          <h1>SUJIN</h1>
          <p>Not Found</p>
        </PageHeader>
      </Public>
    );
  }
}

export default NotFound;
