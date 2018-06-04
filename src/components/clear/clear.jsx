import React from 'react'
import PropTypes from 'prop-types'

import styles from './clear.module.scss'

export class Clear extends React.Component {
  render() {
    if(this.props.renderClearButton) return this.props.renderClearButton({focused: this.props.focused});
    const className = [
      styles.container,
      this.props.className,
      this.props.focused ? styles.focused : null,
      this.props.active ? styles.active : null,
    ].join(" ")

    return <svg className={className} width="0" height="0" viewBox="0 0 11 11" onClick={this.props.onClick} onMouseDown={this.props.onMouseDown}>
      <path d="M6.55624874,5.5 L10.7812437,9.72499498 C11.0729188,10.01667 11.0729188,10.4895687 10.7812437,10.7812437 C10.4895687,11.0729188 10.01667,11.0729188 9.72499498,10.7812437 L5.5,6.55624874 L1.27500502,10.7812437 C0.983329985,11.0729188 0.510431314,11.0729188 0.218756278,10.7812437 C-0.0729187592,10.4895687 -0.0729187592,10.01667 0.218756278,9.72499498 L4.44375126,5.5 L0.218756278,1.27500502 C-0.0729187592,0.983329985 -0.0729187592,0.510431314 0.218756278,0.218756278 C0.510431314,-0.0729187592 0.983329985,-0.0729187592 1.27500502,0.218756278 L5.5,4.44375126 L9.72499498,0.218756278 C10.01667,-0.0729187592 10.4895687,-0.0729187592 10.7812437,0.218756278 C11.0729188,0.510431314 11.0729188,0.983329985 10.7812437,1.27500502 L6.55624874,5.5 Z" />
    </svg>
  }
  static propTypes = {
    focused: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
  }
}