const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  id: string;
  file: string;
}

class Gist extends Component<Props> {
  componentDidMount(): void {
    const { id, file } = this.props;
    const iFrameId = file ? `gist-${id}-${file}` : `gist-${id}`;
    const fileArg = file ? `?file=${file}` : '';
    const gistLink = `https://gist.github.com/${id}.js${fileArg}`;
    const styles = '<style>*{font-size:12px;}</style>';
    const resizeScript = `onload="parent.document.getElementById('${iFrameId}').style.height=document.body.scrollHeight + 'px'"`;
    const gistScript = `<script type="text/javascript" src="${gistLink}"></script>`;
    const iframeHtml = `<html><head><base target="_parent">${styles}</head><body ${resizeScript}>${gistScript}</body></html>`;

    const doc = this.refs.gist.contentDocument;

    doc.open();
    doc.write(iframeHtml);
    doc.close();
  }

  render(): JSX.Element {
    const { id, file } = this.props;
    const iFrameId = file ? `gist-${id}-${file}` : `gist-${id}`;

    return (
      <iframe width="100%" frameBorder="0" id={iFrameId} ref="gist" title={iFrameId} />
    );
  }
}

export default compose([])(Gist);
