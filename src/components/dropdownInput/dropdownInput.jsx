import React from 'react'
import PropTypes from 'prop-types'
import TetherComponent from 'react-tether'
import {Map} from 'immutable'

import {_Input} from '../_input.jsx'
import {Dropdown} from '../dropdown/dropdown.jsx'
import {Clear} from '../clear/clear.jsx'
import {Chevron} from '../chevron/chevron.jsx'

import styles from './dropdownInput.module.scss'

export class DropdownInput extends _Input {
  state = {}
  constructor(props) {
    super(props);
    this.elm = React.createRef();
  }

  componentDidMount = () =>  { this.updateSize(); }
  componentDidUpdate = () => { this.updateSize(); }

  updateSize = () => {
    const elmWidth = this.elm && this.elm.current && this.elm.current.clientWidth;
    const elmHeight = this.elm && this.elm.current && this.elm.current.clientHeight;

    if(this.state.elmWidth !== elmWidth || this.state.elmHeight !== elmHeight) {
      this.setState(state => ({...state, elmWidth, elmHeight}))
    }
  }

  onFocusOption = (focusedOptionIndex, focusedOption) => {
    this.setState(state => ({...state, focusedOptionIndex, focusedOption}))
  }
  
  onFocus = () => {
    const focusedOptionIndex = 0;
    let focusedOption = this.state.filteredOptions != null && this.state.filteredOptions.get(focusedOptionIndex);
    if(this.props.noOptionTransformFromInputValue != null && this.state.filteredOptions != null && this.state.filteredOptions.count() === 0) {
      focusedOption = this.props.noOptionTransformFromInputValue != null && this.props.noOptionTransformFromInputValue(this.state.inputValue)
    }
    this.setState(state => ({...state, focusedOptionIndex, focusedOption, showDropdown: true}))
  }

  onBlur = () => {
    this.setState(state => ({...state, focusedOptionIndex: null, focusedOption: null, showDropdown: false}))
  }

  onKeyUp = (e) => {
    if(e.key === "Enter") {
      if(this.state.focusedOption) {
        e.preventDefault();
        this.onSelectOption(this.state.focusedOption);
        e.target.blur();
      }
    }
  }

  onKeyDown = (e) => {
    if(e.key === "ArrowDown") {
      e.preventDefault();
      this.setState(state => {
        const optionsCount = (this.state.filteredOptions && this.state.filteredOptions.count()) || 0;
        const focusedOptionIndex = (state.focusedOptionIndex + 1 + optionsCount) % optionsCount;
        const focusedOption = this.state.filteredOptions != null && this.state.filteredOptions.get(focusedOptionIndex);
        return {...state, focusedOptionIndex, focusedOption}
      })
    } else if(e.key === "ArrowUp") {
      e.preventDefault();
      this.setState(state => {
        const optionsCount = (this.state.filteredOptions != null && this.state.filteredOptions.count()) || 0;
        const focusedOptionIndex = (state.focusedOptionIndex - 1 + optionsCount) % optionsCount;
        const focusedOption = this.state.filteredOptions != null && this.state.filteredOptions.get(focusedOptionIndex);
        return {...state, focusedOptionIndex, focusedOption}
      })
    } else if(e.key === "Escape") {
      e.preventDefault();
      e.target.blur();
    }
  }

  optionToValueTransform = (option) => {
    if(this.props.optionToValueTransform) return this.props.optionToValueTransform(option);
    else return option;
  }

  onSelectOption = (option) => {
    const value = this.optionToValueTransform(option);
    if(this.props.name != null) {
      const newData = ((this.props.data != null && this.props.data) || Map()).setIn(this.props.name.split('.'), value);
      if(this.props.onUpdate) { this.props.onUpdate(newData); }
    } else {
      if(this.props.onUpdate) { this.props.onUpdate(value); }
    }
    this.setState(state => ({...state, inputValue: null}))
  }

  onInputChange = (e) => {
    const inputValue = e.target.value;
    if(this.props.noOptionTransformFromInputValue != null && this.state.filteredOptions != null && this.state.filteredOptions.count() === 0) {
      const focusedOption = this.props.noOptionTransformFromInputValue != null && this.props.noOptionTransformFromInputValue(inputValue);
      this.setState(state => ({...state, inputValue, focusedOption, focusedOptionIndex: 0}));
    } else {
      this.setState(state => ({...state, inputValue}));
    }
  }
  
  hasValue = () => DropdownInput.getValue(this.props) != null;

  valueRender = () => {
    const value = DropdownInput.getValue(this.props);
    return <div className={styles.value}>{value}</div>
  }

  onClearClick = () => { this.onSelectOption(undefined); }

  render() {
    const hasValue = this.hasValue();
    const hasInputValue = this.state.inputValue != null && this.state.inputValue.length > 0;
    const showDropdown = this.state.showDropdown;
    const noOptionOption = hasInputValue ? this.state.focusedOption : null;
    
    const className = [
      styles.container,
      showDropdown ? styles.focused : null,
      hasValue ? styles.hasValue : null,
      hasInputValue ? styles.hasInputValue : null,
    ].join(' ')

    const style = DropdownInput.getAccentStyles(this.props.accent);

    return <TetherComponent attachment="top left"
      targetAttachment="bottom left"
      constraints={[{to: 'window', attachment: 'together'}]}
      classes={{element: styles.tetheredElement}}>
      
      <label className={className} ref={this.elm} style={style}>
        <div className={styles.content}>
          <div className={styles.cursor} />
          <input className={styles.input}
            placeholder={this.props.placeholder}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            onChange={this.onInputChange}
            value={this.state.inputValue || ''}
            autoFocus={this.props.autoFocus}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            name={this.props.name} />
          {this.valueRender()}
        </div>
        <Clear className={styles.clearButton} onClick={this.onClearClick} />
        <Chevron className={styles.button} />
      </label>
      
      {showDropdown && <Dropdown options={this.state.filteredOptions}
        onSelectOption={this.onSelectOption}
        onFocusOption={this.onFocusOption}
        focusedOption={this.state.focusedOption}
        focusedOptionIndex={this.state.focusedOptionIndex}
        optionRender={this.props.optionRender}
        maxHeight={this.props.maxHeight}
        optionDisplayKey={this.props.optionDisplayKey}
        width={this.state.elmWidth}
        noOptionOption={noOptionOption}
        showFirstOption={hasInputValue && this.props.firstOptionTransformFromInputValue != null}
        showLastOption={hasInputValue && this.props.lastOptionTransformFromInputValue != null}
        style={style} />}

    </TetherComponent>
  }

  static optionsIsEqual = (props, option1, option2) => {
    if(props.optionsIsEqual)
      return props.optionsIsEqual(option1, option2, {optionFilterKey: props.optionFilterKey})
    else if(option1 != null && option1.get && option2 != null && option2.get && props.optionFilterKey != null)
      return option1.get(props.optionFilterKey) === option2.get(props.optionFilterKey)
    else return option1 === option2;
  }

  static getValue = (props) => {
    const data = ((props.data != null && props.data) || Map()).getIn(props.name.split('.'));
    if(data != null && data.get && props.valueDisplayKey != null) return data.get(props.valueDisplayKey);
    else return data;
  }

  static getDerivedStateFromProps = (props, state) => {
    const inputValue = state.inputValue != null && state.inputValue.toLowerCase();
    
    let filteredOptions = props.options != null && props.options.filter(option => {
      if(state.inputValue == null)
        return true;
      else if(props.filterOption)
        return props.filterOption({
          option,
          filterCaseSensitive: props.filterCaseSensitive,
          inputValue: state.inputValue,
          optionFilterKey: props.optionFilterKey
        })
      else if(option != null && option.get && props.optionFilterKey != null) {
        const optionGet = option.get(props.optionFilterKey)
        if(props.filterCaseSensitive) return optionGet && optionGet.indexOf(state.inputValue) >= 0;
        else return optionGet && optionGet.toLowerCase().indexOf(inputValue) >= 0;
      }
      else return true;
    });

    if(props.firstOptionTransformFromInputValue && state.inputValue != null) {
      filteredOptions = filteredOptions.unshift( (props.firstOptionTransformFromInputValue != null && props.firstOptionTransformFromInputValue(state.inputValue)) )
    }
    if(props.lastOptionTransformFromInputValue && state.inputValue != null) {
      filteredOptions = filteredOptions.push( (props.lastOptionTransformFromInputValue != null && props.lastOptionTransformFromInputValue(state.inputValue)) )
    }

    let focusedOptionIndex = filteredOptions != null && filteredOptions.findIndex(option =>
      DropdownInput.optionsIsEqual(props, option, state.focusedOption)
    );
    let focusedOption = (focusedOptionIndex != null) ? filteredOptions != null && filteredOptions.get(focusedOptionIndex) : null

    if(filteredOptions != null && filteredOptions.count() === 0 && props.noOptionTransformFromInputValue != null) {
      focusedOptionIndex = 0;
      focusedOption = props.noOptionTransformFromInputValue != null && props.noOptionTransformFromInputValue(state.inputValue)
    }

    return { filteredOptions, focusedOptionIndex, focusedOption };
  }

  static propTypes = {
    accent: PropTypes.string.isRequired,
    optionRender: PropTypes.func,
    valueRender: PropTypes.func,
    filterOption: PropTypes.func,
    onUpdate: PropTypes.func,
    optionToValueTransform: PropTypes.func,
    noOptionTransformFromInputValue: PropTypes.func,
    firstOptionTransformFromInputValue: PropTypes.func,
    lastOptionTransformFromInputValue: PropTypes.func,

    optionDisplayKey: PropTypes.string,
    optionFilterKey: PropTypes.string,
    valueDisplayKey: PropTypes.string,

    data: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.string]),
    name: PropTypes.string,
    maxHeight: PropTypes.number,
    filterCaseSensitive: PropTypes.bool,
  }

  static defaultProps = {
    maxHeight: 200,
    filterCaseSensitive: false,
    ..._Input.defaultProps,
  }
}