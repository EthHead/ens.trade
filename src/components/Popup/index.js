import React from 'react';
import s from './Popup.css';
import Button from '../../components/Button';

class Popup extends React.Component {
  static propTypes = {
    active: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    confirmText: React.PropTypes.string,
    children: React.PropTypes.object, //TODO: Fix this error
  };
  constructor(props) {
    super(props);
    this.test = 'test';
  }
  componentDidMount() {
    document.addEventListener('click', this.onClickOutside, true);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside, true);
  }
  onClickOutside = (e) => {
    if (e.target.id === this.test) this.close();
  }
  close = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  render() {
    if (!this.props.active) return (<span />);
    return (
      <div>
        <div className={s.background} />
        <div className={s.holder} id={this.test} onClick={this.onClickOutside}>
          <div className={s.container}>
            <button className={s.close} type="button" onClick={this.close}><img src="/images/close.svg" alt="close button" /></button>
            <div className={s.main}>{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
