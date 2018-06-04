import React, { Component } from 'react';
import {Map, List} from 'immutable';

import styles from './App.module.scss';

import {DropdownInput } from './components/dropdownInput/dropdownInput.jsx'
import {DropdownInputMulti } from './components/dropdownInputMulti/dropdownInputMulti.jsx'

class App extends Component {
  state = {
    data: Map.of('dropdownMulti', List.of(
    ))
  }
  noOptionTransformFromInputValue = (inputValue) => {
    return Map.of('label', inputValue, 'count', 100)
  }
  optionRender = ({data, focused, optionDisplayKey, ...props}) => {
    const className = [
      styles.item,
      focused ? styles.focused : null,
    ].join(' ')

    return <div {...props} className={className}>
      <div>{data.get('label')}</div>
      <div className={styles.spacer} />
      <div>{data.get('count')}</div>
    </div>
  }

  onUpdate = (data) => {
    this.setState(state => ({...state, data}))
  }

  render() {
    const options = List.of(
      Map.of('label', 'Boston', 'count', 10),
      Map.of('label', 'Chicago', 'count', 1),
      Map.of('label', 'San Francisco', 'count', 100),
      Map.of('label', 'Palo Alto', 'count', 100),
      Map.of('label', 'Seattle', 'count', 100),
      Map.of('label', 'New York', 'count', 100),
      Map.of('label', 'Atlanta', 'count', 100),
      Map.of('label', 'Austin', 'count', 100),
      Map.of('label', 'Washignton D.C.', 'count', 100),
    )

    return (
      <div className={styles.container}>
        <DropdownInput placeholder="placeholder" autoFocus
          optionDisplayKey='label'
          valueDisplayKey='label'
          optionFilterKey='label'
          optionRender={this.optionRender}
          onUpdate={this.onUpdate}
          data={this.state.data}
          name='dropdown'
          options={options}
          noOptionTransformFromInputValue={this.noOptionTransformFromInputValue} />
        <DropdownInputMulti placeholder="multi" autoFocus
          optionDisplayKey='label'
          valueDisplayKey='label'
          optionFilterKey='label'
          optionRender={this.optionRender}
          onUpdate={this.onUpdate}
          data={this.state.data}
          name='dropdownMulti'
          options={options}
          noOptionTransformFromInputValue={this.noOptionTransformFromInputValue} />
      </div>
    );
  }
}

export default App;
