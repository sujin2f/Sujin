import { IRestController } from 'app/controllers/rest/index.d';
import GlobalController from 'app/controllers/global';

// pendingComponents
import NotFound from 'app/scenes/public/NotFound';
import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';

// React
const { Component, Fragment } = wp.element;

interface Props {} // eslint-disable-line @typescript-eslint/no-empty-interface

abstract class BaseControllerComponent extends Component {
  constructor(public props: Props) {
    super(props);
    this.getController = this.getController.bind(this);
    this.getPendingComponent = this.getPendingComponent.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.request = this.request.bind(this);
  }

  public abstract getController(): IRestController;

  public getPendingComponent(): JSX.Element {
    const controller = this.getController();

    if (!controller.init) {
      return (
        <Fragment />
      );
    }

    if (controller.loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    if (controller.failed) {
      return (
        <NotFound />
      );
    }

    return null;
  }

  public setTitle(title: string): void {
    GlobalController.getInstance().setTitle(title);
  }

  public async request(): Promise<void> {
    return this.getController().request().promise;
  }
}

export default BaseControllerComponent;
