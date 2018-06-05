import React from 'react'
import PropTypes from 'prop-types'
import TetherComponent from 'react-tether'
import {List, Map} from 'immutable'

import {_Input} from '../_input.jsx'
import {Dropdown} from '../dropdown/dropdown.jsx'
import {Clear} from '../clear/clear.jsx'
import {Chevron} from '../chevron/chevron.jsx'

import styles from './dropdownInputMulti.module.scss'

export class DropdownInputMulti extends _Input {
  state = {}
  constructor(props) {
    super(props);
    this.elm = React.createRef();
  }

  componentDidMount = () =>  { this.updateSize(); }
  componentDidUpdate = () => { this.updateSize(); }

  updateSize = () => {
    const elmWidth = this.elm?.current?.clientWidth;
    const elmHeight = this.elm?.current?.clientHeight;

    if(this.state.elmWidth !== elmWidth || this.state.elmHeight !== elmHeight) {
      this.setState(state => ({...state, elmWidth, elmHeight}))
    }
  }

  onFocusOption = (focusedOptionIndex, focusedOption) => {
    this.setState(state => ({...state, focusedOptionIndex, focusedOption}))
  }
  
  onFocus = () => {
    const focusedOptionIndex = 0;
    let focusedOption = this.state.filteredOptions?.get(focusedOptionIndex);
    if(this.props.noOptionTransformFromInputValue != null && this.state.filteredOptions?.count() === 0) {
      focusedOption = this.props.noOptionTransformFromInputValue?.(this.state.inputValue)
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
        this.setState(state => {
          const optionsCount = this.state.filteredOptions?.count() || 0;
          const focusedOptionIndex = (state.focusedOptionIndex + 1 + optionsCount) % optionsCount;
          const focusedOption = this.state.filteredOptions?.get(focusedOptionIndex);
          return {...state, focusedOptionIndex, focusedOption}
        })
        if(this.props.blurOnAddValue) e.target.blur();
      }
    }
  }

  onKeyDown = (e) => {
    if(e.key === "ArrowDown") {
      e.preventDefault();
      this.setState(state => {
        const optionsCount = this.state.filteredOptions?.count() || 0;
        const focusedOptionIndex = (state.focusedOptionIndex + 1 + optionsCount) % optionsCount;
        const focusedOption = this.state.filteredOptions?.get(focusedOptionIndex);
        return {...state, focusedOptionIndex, focusedOption}
      })
    } else if(e.key === "ArrowUp") {
      e.preventDefault();
      this.setState(state => {
        const optionsCount = this.state.filteredOptions?.count() || 0;
        const focusedOptionIndex = (state.focusedOptionIndex - 1 + optionsCount) % optionsCount;
        const focusedOption = this.state.filteredOptions?.get(focusedOptionIndex);
        return {...state, focusedOptionIndex, focusedOption}
      })
    } else if(e.key === "Escape") {
      e.preventDefault();
      e.target.blur();
    } else if(e.key === "Delete" || e.key === "Backspace") {
      if(e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        if(this.props.name != null) {
          const newData = (this.props.data || Map())?.updateIn(this.props.name.split('.'), data => data.delete(-1));
          this.props.onUpdate?.(newData);
        } else {
          this.props.onUpdate?.((this.props.data || List()).delete(-1));
        }
      }
    } 
  }

  optionToValueTransform = (option) => {
    if(this.props.optionToValueTransform) return this.props.optionToValueTransform(option);
    else return option;
  }

  onSelectOption = (optionToAdd) => {
    const valueToAdd = this.optionToValueTransform(optionToAdd);
    if(this.props.name != null) {
      const newData = (this.props.data || Map())?.updateIn(this.props.name.split('.'), (data) => {
        return (data || List())
          .filter(value => !DropdownInputMulti.valueIsEqualToValue(this.props, value, valueToAdd))
          .push(valueToAdd);
      });
      this.props.onUpdate?.(newData);
    } else {
      this.props.onUpdate?.( (this.props.data || List())
        .filter(value => !DropdownInputMulti.valueIsEqualToValue(this.props, value, valueToAdd))
        .push(valueToAdd))
    }
    this.setState(state => ({...state, inputValue: null}))
  }

  onInputChange = (e) => {
    const inputValue = e.target.value;
    if(this.props.noOptionTransformFromInputValue != null && this.state.filteredOptions?.count() === 0) {
      const focusedOption = this.props.noOptionTransformFromInputValue?.(inputValue);
      this.setState(state => ({...state, inputValue, focusedOption, focusedOptionIndex: 0}));
    } else {
      this.setState(state => ({...state, inputValue}));
    }
  }
  
  hasValue = () => DropdownInputMulti.getValues(this.props) != null;

  valuesRender = () => {
    const values = DropdownInputMulti.getValues(this.props);
    return <>
      {values?.map(this.valueRender)}
    </>
  }

  valueRender = (option, key) => {
    const value = DropdownInputMulti.getValue(this.props, option);
    return <div key={key} className={styles.tag}>
      <div className={styles.tagValue}>{value}</div>
      <Clear className={styles.tagClear} onClick={this.onDeleteTag(option)} />
    </div>
  }

  onDeleteTag = (valueToDelete) => () => {
    if(this.props.name != null) {
      const newData = (this.props.data || Map())?.updateIn(this.props.name.split('.'), (data) => {
        return (data || List())
          .filter(option => !DropdownInputMulti.optionIsEqualToValue(this.props, option, valueToDelete))
      });
      this.props.onUpdate?.(newData);
    } else {
      this.props.onUpdate?.( (this.props.data || List())
        .filter(option => !DropdownInputMulti.optionIsEqualToValue(this.props, option, valueToDelete)));
    }
    this.setState(state => ({...state, inputValue: null}))
  }

  onClearClick = () => { this.onSelectOption(undefined); }

  render() {
    const hasValue = this.hasValue();
    const hasInputValue = this.state.inputValue?.length > 0;
    const showDropdown = this.state.showDropdown;
    const noOptionOption = hasInputValue ? this.state.focusedOption : null;

    const style = DropdownInputMulti.getAccentStyles(this.props.accent);
    
    const className = [
      styles.container,
      showDropdown ? styles.focused : null,
      hasValue ? styles.hasValue : null,
      hasInputValue ? styles.hasInputValue : null,
    ].join(' ')
    
    return <TetherComponent attachment="top left"
      targetAttachment="bottom left"
      constraints={[{to: 'window', attachment: 'together'}]}
      classes={{element: styles.tetheredElement}}>
      
      <label className={className} ref={this.elm} style={style}>
        <div className={styles.content}>
          {this.valuesRender()}
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
        noOptionRender={this.props.noOptionRender}
        maxHeight={this.props.maxHeight}
        optionDisplayKey={this.props.optionDisplayKey}
        width={this.state.elmWidth}
        noOptionOption={noOptionOption}
        showFirstOption={hasInputValue && this.state.firstOption != null}
        showLastOption={hasInputValue && this.state.lastOption != null}
        style={style} />}

    </TetherComponent>
  }

  static optionsIsEqual = (props, option1, option2) => {
    if(props.optionsIsEqual)
      return props.optionsIsEqual(option1, option2, {optionFilterKey: props.optionFilterKey, filterCaseSensitive: props.filterCaseSensitive})
    else if(option1?.get && option2?.get && props.optionFilterKey != null) {
      if(props.filterCaseSensitive) return option1.get(props.optionFilterKey) === option2.get(props.optionFilterKey)
      else return option1.get(props.optionFilterKey)?.toLowerCase?.() === option2.get(props.optionFilterKey)?.toLowerCase?.()
    } else {
      if(props.filterCaseSensitive) return option1 === option2;
      else return option1?.toLowerCase?.() === option2?.toLowerCase?.();
    }
  }

  static optionIsEqualToValue = (props, option, value) => {
    if(props.optionIsEqualToValue)
      return props.optionIsEqualToValue(option, value, {optionFilterKey: props.optionFilterKey, filterCaseSensitive: props.filterCaseSensitive})
    else return DropdownInputMulti.optionsIsEqual(props, option, value)
  }

  static valueIsEqualToValue = (props, value1, value2) => {
    if(props.valueIsEqualToValue)
      return props.valueIsEqualToValue(value1, value2, {valueDisplayKey: props.valueDisplayKey, filterCaseSensitive: props.filterCaseSensitive})
    else if(value1?.get && value2?.get && props.valueDisplayKey != null) {
      if(props.filterCaseSensitive) return value1.get(props.valueDisplayKey) === value2.get(props.valueDisplayKey)
      else return value1.get(props.valueDisplayKey)?.toLowerCase?.() === value2.get(props.valueDisplayKey)?.toLowerCase?.()
    }
    else {
      if(props.filterCaseSensitive) return value1 === value2;
      else return value1?.toLowerCase?.() === value2?.toLowerCase?.();
    }
  }

  static getValues = (props) => {
    if(props.name != null) {
      return (props.data || Map())?.getIn(props.name.split('.'));
    } else {
      return (props.data || List())
    }
  }

  static getValue = (props, option) => {
    if(option?.get && props.valueDisplayKey != null) return option.get(props.valueDisplayKey);
    else return option;
  }

  static getDerivedStateFromProps = (props, state) => {
    const values = DropdownInputMulti.getValues(props);
    const inputValue = state.inputValue?.toLowerCase();

    let firstOption = props.firstOptionTransformFromInputValue?.(state.inputValue);
    let lastOption = props.lastOptionTransformFromInputValue?.(state.inputValue);

    let filteredOptions = props.options?.filter(option => {
      const containsOption = values?.find(value => DropdownInputMulti.optionIsEqualToValue(props, option, value)) != null;

      /*sideeffect*/
      if( DropdownInputMulti.optionsIsEqual(props, firstOption, option) ) firstOption = null;
      if( DropdownInputMulti.optionsIsEqual(props, lastOption, option) ) lastOption = null;
      
      if(containsOption === true) return false;
      else if(state.inputValue == null) return true;
      else if(props.filterOption)
        return props.filterOption({
          option,
          values,
          filterCaseSensitive: props.filterCaseSensitive,
          inputValue: state.inputValue,
          optionFilterKey: props.optionFilterKey
        })
      else if(option?.get && props.optionFilterKey != null) {
        if(props.filterCaseSensitive)
          return option.get(props.optionFilterKey)?.indexOf(state.inputValue) >= 0;
        else
          return option.get(props.optionFilterKey)?.toLowerCase()?.indexOf(inputValue) >= 0;
      }
      else return true;
    });
    
    if(props.firstOptionTransformFromInputValue && (state.inputValue || "").length > 0 && firstOption != null) {
      filteredOptions = filteredOptions.unshift(firstOption);
    }
    if(props.lastOptionTransformFromInputValue && (state.inputValue || "").length > 0 && lastOption != null) {
      filteredOptions = filteredOptions.push(lastOption);
    }

    let focusedOptionIndex = filteredOptions?.findIndex(option =>
      DropdownInputMulti.optionsIsEqual(props, option, state.focusedOption)
    );
    let focusedOption = (focusedOptionIndex != null) ? filteredOptions?.get(focusedOptionIndex) : null

    if(filteredOptions?.count() === 0 && props.noOptionTransformFromInputValue != null) {
      focusedOptionIndex = 0;
      focusedOption = props.noOptionTransformFromInputValue?.(state.inputValue)
    }

    return { filteredOptions, focusedOptionIndex, focusedOption, firstOption, lastOption };
  }

  static propTypes = { 
    optionRender: PropTypes.func,
    noOptionRender: PropTypes.func,
    valuesRender: PropTypes.func,
    filterOption: PropTypes.func,
    onUpdate: PropTypes.func,
    noOptionTransformFromInputValue: PropTypes.func,
    firstOptionTransformFromInputValue: PropTypes.func,
    lastOptionTransformFromInputValue: PropTypes.func,
    optionIsEqualToValue: PropTypes.func,

    optionDisplayKey: PropTypes.string,
    optionFilterKey: PropTypes.string,
    valueDisplayKey: PropTypes.string,

    data: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.instanceOf(List), PropTypes.string]),
    name: PropTypes.string,
    maxHeight: PropTypes.number,
    filterCaseSensitive: PropTypes.bool,
    blurOnAddValue: PropTypes.bool,
    
  }

  static defaultProps = {
    maxHeight: 200,
    filterCaseSensitive: false,
    blurOnAddValue: false,
    ..._Input.defaultProps,
  }
}