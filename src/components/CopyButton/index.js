import React from 'react';
import copy from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import s from './CopyButton.css';
import Button from '../../components/Button';

class CopyButton extends React.Component {
  static propTypes = {
    data: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      timeoutEvent: null,
    };
  }

  doCopy = () => {
    if (this.state.timeoutEvent) {
      clearTimeout(this.state.timeoutEvent);
    }
    this.setState({
      copied: true,
      timeoutEvent: setTimeout(() => {
        this.setState({ copied: false });
      }, 1000),
    });
    copy(this.props.data);
  }

  render() {
    const id = `button${Math.random()}`;
    return (
      <div className={s.copy} onClick={this.doCopy}>
        <img className={s.copyImg} src={`/images/${this.state.copied ? 'checked' : 'copy'}.svg`} alt="copy" data-tip data-for={id} />
        <ReactTooltip id={id}>Copy to clipboard</ReactTooltip>
      </div>
    );
  }
}

export default CopyButton;
