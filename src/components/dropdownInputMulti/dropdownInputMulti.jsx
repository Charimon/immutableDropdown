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
  componentDidUpdate = (prevProps, prevState) => { this.updateSize(); }

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
  
  onFocus = (e) => {
    const focusedOptionIndex = 0;
    let focusedOption = this.state.filteredOptions?.get(focusedOptionIndex);
    if(this.props.noOptionTransformFromInputValue != null && this.state.filteredOptions?.count() === 0) {
      focusedOption = this.props.noOptionTransformFromInputValue?.(this.state.inputValue)
    }
    this.setState(state => ({...state, focusedOptionIndex, focusedOption, showDropdown: true}))
  }

  onBlur = (e) => {
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

  onSelectOption = (optionToAdd) => {
    if(this.props.name != null) {
      const newData = (this.props.data || Map())?.updateIn(this.props.name.split('.'), (data) => {
        return (data || List())
          .filter(option => !DropdownInputMulti.optionsIsEqual(this.props, option, optionToAdd))
          .push(optionToAdd);
      });
      this.props.onUpdate?.(newData);
    } else {
      this.props.onUpdate?.( (this.props.data || List())
        .filter(option => !DropdownInputMulti.optionsIsEqual(this.props, option, optionToAdd))
        .push(optionToAdd))
    }
    this.setState(state => ({inputValue: null}))
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

  onDeleteTag = (optionToDelete) => (e) => {
    if(this.props.name != null) {
      const newData = (this.props.data || Map())?.updateIn(this.props.name.split('.'), (data) => {
        return (data || List())
          .filter(option => !DropdownInputMulti.optionsIsEqual(this.props, option, optionToDelete))
      });
      this.props.onUpdate?.(newData);
    } else {
      this.props.onUpdate?.( (this.props.data || List())
        .filter(option => !DropdownInputMulti.optionsIsEqual(this.props, option, optionToDelete)));
    }
    this.setState(state => ({inputValue: null}))
  }

  onClearClick = (e) => {
    this.onSelectOption(undefined)
  }

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
        style={style} />}

    </TetherComponent>
  }

  static optionsIsEqual = (props, option1, option2) => {
    if(props.optionsIsEqual)
      return props.optionsIsEqual(option1, option2, {optionFilterKey: props.optionFilterKey})
    else if(option1?.get && option2?.get && props.optionFilterKey != null)
      return option1.get(props.optionFilterKey) === option2.get(props.optionFilterKey)
    else return option1 === option2;
  }

  static getValues = (props) => {
    return (props.data || Map())?.getIn(props.name.split('.'));
  }

  static getValue = (props, option) => {
    if(option?.get && props.valueDisplayKey != null) return option.get(props.valueDisplayKey);
    else return option;
  }

  static getDerivedStateFromProps = (props, state) => {
    const values = DropdownInputMulti.getValues(props);
    const inputValue = state.inputValue?.toLowerCase();

    const filteredOptions = props.options?.filter(option => {
      const containsOption = values?.find(value => DropdownInputMulti.optionsIsEqual(props, option, value)) != null;
      
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

    let focusedOptionIndex = filteredOptions?.findIndex(option =>
      DropdownInputMulti.optionsIsEqual(props, option, state.focusedOption)
    );
    let focusedOption = (focusedOptionIndex != null) ? filteredOptions?.get(focusedOptionIndex) : null

    if(filteredOptions?.count() === 0 && props.noOptionTransformFromInputValue != null) {
      focusedOptionIndex = 0;
      focusedOption = props.noOptionTransformFromInputValue?.(state.inputValue)
    }

    return { filteredOptions, focusedOptionIndex, focusedOption };
  }

  static propTypes = { 
    optionRender: PropTypes.func,
    noOptionRender: PropTypes.func,
    valuesRender: PropTypes.func,
    filterOption: PropTypes.func,
    onUpdate: PropTypes.func,
    noOptionTransformFromInputValue: PropTypes.func,

    optionDisplayKey: PropTypes.string,
    optionFilterKey: PropTypes.string,
    valueDisplayKey: PropTypes.string,

    data: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.string]),
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