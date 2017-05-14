import React from 'react';
import Link from '../Link';

class Navigation extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    return (
      <nav className="mdl-navigation" ref={node => (this.root = node)}>
        <Link className="mdl-navigation__link" to="/">Home</Link>
        <Link className="mdl-navigation__link" to="/about">About</Link>
      </nav>
    );
  }

}

export default Navigation;
