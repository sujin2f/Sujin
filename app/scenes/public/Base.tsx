import NotFound from 'app/scenes/public/NotFound';
import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';

const { Component, Fragment } = wp.element;
const { compose } = wp.compose;

interface Props {
  componentHash: string;
}

class Base extends Component<Props> {
  constructor(public props: Props) {
    super(props);
    this.getPendingComponent = this.getPendingComponent.bind(this);
  }

  getPendingComponent(init: boolean, loading: boolean, failed: boolean): JSX.Element {
    if (!init) {
      return (
        <Fragment />
      );
    }

    if (loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    if (failed) {
      return (
        <NotFound />
      );
    }

    return null;
  }
}

export default compose([])(Base);
