/**  app/scenes/WithController */

// Controllers
import { IRestController } from 'app/controllers/rest';
import GlobalController from 'app/controllers/global';

// Wordpress
const { Component } = wp.element;

interface Props {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/*
 * For React components which uses Controller
 */
export abstract class WithController extends Component {
  constructor(public props: Props) {
    super(props);
    this.getController = this.getController.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.isPending = this.isPending.bind(this);
    this.request = this.request.bind(this);
  }

  public abstract getController(): IRestController;

  public setTitle(title: string): void {
    GlobalController.getInstance().setTitle(title);
  }

  public isPending(): string|null {
    const controller = this.getController();

    if (!controller.init) {
      return 'init';
    }

    if (controller.loading) {
      return 'loading';
    }

    if (controller.failed) {
      return 'failed';
    }

    return null;
  }

  public async request(): Promise<void> {
    return this.getController().request().promise;
  }
}
