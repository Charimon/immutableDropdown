import React from 'react'
import PropTypes from 'prop-types'
import {List, Map} from 'immutable'

import styles from './dropdown.module.scss'

class DropdownItem extends React.Component {
  constructor(props) {
    super(props);
    this.elm = React.createRef();
  }
  onMouseEnter = (option) => () => { if(this.props.onFocusOption != null) { this.props.onFocusOption(option) }; }
  onMouseDown = (option) => () => { if(this.props.onSelectOption != null) { this.props.onSelectOption(option) }; }

  scrollIntoView = () => {
    const current = this.elm.current;
    const parent = current.offsetParent;
    
    if(current.offsetTop < parent.scrollTop) {
      parent.scrollTop = current.offsetTop;
    } else if(current.offsetTop + current.offsetHeight > parent.scrollTop + parent.offsetHeight) {
      parent.scrollTop += current.offsetTop + current.offsetHeight - parent.scrollTop - parent.offsetHeight;
    }
  }

  render() {
    if(this.props.optionRender) return this.props.optionRender({
      onMouseEnter: this.onMouseEnter(this.props.data),
      onMouseDown: this.onMouseDown(this.props.data),
      ref: this.elm,
      data: this.props.data,
      focused: this.props.focused,
      optionDisplayKey: this.props.optionDisplayKey
    })

    let value = this.props.data;
    if(this.props.data && this.props.data.get && this.props.optionDisplayKey != null) value = this.props.data.get(this.props.optionDisplayKey);

    const className = [
      styles.item,
      this.props.focused ? styles.focused : null,
    ].join(' ')
    return <div className={className}
      onMouseEnter={this.onMouseEnter(this.props.data)}
      onMouseDown={this.onMouseDown(this.props.data)}
      ref={this.elm}>{value}</div>
  }

  static propTypes = {
    onFocusOption: PropTypes.func,
    optionRender: PropTypes.func,
  }
}

class DropdownAddItem extends React.Component {
  constructor(props) {
    super(props);
    this.elm = React.createRef();
  }
  onMouseEnter = (option) => () => { if(this.props.onFocusOption != null) { this.props.onFocusOption(option) } };
  onMouseDown = (option) => () => { if(this.props.onSelectOption != null) { this.props.onSelectOption(option) } };

  render() {
    if(this.props.noOptionRender) return this.props.noOptionRender({
      onMouseEnter: this.onMouseEnter(this.props.data),
      onMouseDown: this.onMouseDown(this.props.data),
      ref: this.elm,
      data: this.props.data,
      focused: this.props.focused,
      optionDisplayKey: this.props.optionDisplayKey
    })

    let value = this.props.data;
    if(this.props.data != null && this.props.data.get && this.props.optionDisplayKey != null) value = this.props.data.get(this.props.optionDisplayKey);

    const className = [
      styles.item,
      this.props.focused ? styles.focused : null,
    ].join(' ')
    return <div className={className}
      onMouseEnter={this.onMouseEnter(this.props.data)}
      onMouseDown={this.onMouseDown(this.props.data)}
      ref={this.elm}>Add <strong>{value}</strong></div>
  }

  static propTypes = {
    onFocusOption: PropTypes.func,
    optionRender: PropTypes.func,
  }
}

export class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.focusedElm = React.createRef();
  }
  onFocusOption = (focusedOptionIndex) => (focusedOption) => {
    if( this.props.onFocusOption != null ) { this.props.onFocusOption(focusedOptionIndex, focusedOption) }
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.focusedOptionIndex !== this.props.focusedOptionIndex) {
      if( this.focusedElm != null && this.focusedElm.current != null && this.focusedElm.current.scrollIntoView != null ) {
        this.focusedElm.current.scrollIntoView();
      }
    }
  }

  render() {
    const style = ({
      width: this.props.width,
      maxHeight: this.props.maxHeight,
      ...this.props.style
    })
    const showNoOptionsItem = (this.props.option != null && this.props.options.count() === 0) && this.props.noOptionOption;
    const isNoOptionFocused = this.props.noOptionOption === this.props.focusedOption;

    return <div className={styles.container} style={style}>
      {this.props.options && this.props.options.map((option, key) => {
        const focused = option === this.props.focusedOption;
        let Tag = DropdownItem;
        if(this.props.showFirstOption && key === 0)
          Tag = DropdownAddItem;
        if(this.props.showLastOption && key === this.props.options.count() - 1)
          Tag = DropdownAddItem;

        return <Tag key={key}
          data={option}
          optionDisplayKey={this.props.optionDisplayKey}
          focused={focused}
          optionRender={this.props.optionRender}
          onFocusOption={this.onFocusOption(key)}
          onSelectOption={this.props.onSelectOption}
          ref={focused ? this.focusedElm : null} />
      })}
      {showNoOptionsItem && <DropdownAddItem
        data={this.props.noOptionOption}
        optionDisplayKey={this.props.optionDisplayKey}
        focused={isNoOptionFocused}
        optionRender={this.props.optionRender}
        onFocusOption={this.onFocusOption(0)}
        onSelectOption={this.props.onSelectOption}
        ref={isNoOptionFocused ? this.focusedElm : null} />}
    </div>
  }

  static propTypes = {
    options: PropTypes.instanceOf(List),
    
    onFocusOption: PropTypes.func,
    onSelectOption: PropTypes.func,
    optionRender: PropTypes.func,
    noOptionRender: PropTypes.func,

    noOptionOption: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.string]),
    focusedOption: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.string]),
    focusedOptionIndex: PropTypes.number,
    maxHeight: PropTypes.number,
    optionDisplayKey: PropTypes.string,
    showFirstOption: PropTypes.bool,
    showLastOption: PropTypes.bool,
  }
}