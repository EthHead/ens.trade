import React from 'react';
import ReactTooltip from 'react-tooltip';

import s from './styles.css';

class Button extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    sideText: React.PropTypes.string,
    active: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    tip: React.PropTypes.string,
    activeTip: React.PropTypes.string,
    noBackground: React.PropTypes.bool,
    inline: React.PropTypes.bool,
  };

  render() {
    const id = `button${Math.random()}`;
    return (
      <div className={this.props.inline ? s.inline : null}>
        <div className={s.holder}>
          <button data-tip data-for={this.props.tip ? id : null} className={`${s.button}`} onClick={this.props.onClick}>{this.props.text}</button>
          {this.props.sideText}
        </div>
        <ReactTooltip id={id}>
          <span>{this.props.tip}</span>
        </ReactTooltip>
      </div>
    )
  }

}

export default Button;
