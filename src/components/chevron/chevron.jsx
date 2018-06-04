import React from 'react'
import PropTypes from 'prop-types'

import styles from './chevron.module.scss'

export class Chevron extends React.Component {
  render() {
    if(this.props.renderClearButton) return this.props.renderClearButton({focused: this.props.focused});
    const className = [
      styles.container,
      this.props.className,
      this.props.focused ? styles.focused : null,
      this.props.active ? styles.active : null,
    ].join(" ")

    return <svg className={className} width="0" height="0" viewBox="0 0 21 15">
      <path d="M9.3055647,13.9170597 C9.38987706,14.0270966 9.48992513,14.124987 9.60274107,14.2077403 C10.2627975,14.6919082 11.2015272,14.5605124 11.6945526,13.9170597 L20.2055577,2.80925669 C20.3968907,2.55954599 20.5,2.25679033 20.5,1.94604111 C20.5,1.14988402 19.8357911,0.5 19.0110637,0.5 L1.98905362,0.5 C1.6649875,0.5 1.35000975,0.602694647 1.09173601,0.792144906 C0.438238066,1.27150204 0.306528638,2.17232224 0.79455965,2.80925669 L9.3055647,13.9170597 Z" />
    </svg>
  }
  static propTypes = {
    focused: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
  }
}