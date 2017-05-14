import React from 'react';
import ReactTooltip from 'react-tooltip';

import s from './styles.css';

class Button extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    sideText: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    tip: React.PropTypes.string,
    activeTip: React.PropTypes.string,
    noBackground: React.PropTypes.bool,
    inline: React.PropTypes.bool,
    type: React.PropTypes.string,
  };

  onClick = (e) => {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    const id = `button${Math.random()}`;
    return (
      <div className={this.props.inline ? s.inline : null}>
        <div className={s.holder}>
          <button
            type={this.props.type ? this.props.type : 'button'}
            disabled={this.props.disabled}
            data-tip
            data-for={this.props.tip ? id : null}
            className={`${s.button}`}
            onClick={this.onClick}>{this.props.text}
          </button>
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
