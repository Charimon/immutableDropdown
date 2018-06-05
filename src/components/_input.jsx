import React from 'react'
import Color from 'color'

export class _Input extends React.Component{
  static getAccentStyles = (accent) => {
    
    const accentColor = Color(accent);
    const backgroundColor = Color(accent).isLight() ? Color("#fff") : Color("#333");
    const backgroundActiveColor = Color(accent).desaturate(0.25).lighten(0.25);
    const borderColor = Color(accent).isLight() ? Color("#666") : Color("#666");
    const buttonColor = Color(accent).isLight() ? Color("#666") : Color("#666");
    const textColor = Color(accent).isLight() ? Color("#666") : Color("#666");
    const borderActiveColor = Color(accent);
    const boxShadow = Color(accent).saturate(0.25).alpha(0.2);
    const dropdownItemBackground = Color(accent);
    const dropdownItemColor = Color(accent).isLight() ? Color("#fff") : Color("#666");
    
    const tagBorderColor = Color(accent).darken(0.25);
    const tagBackgroundColor = Color(accent);
    const tagTextColor = Color(accent).desaturate(1).negate();

    return {
      '--input-button-color': buttonColor.toString(),
      '--input-button-focused-color': accentColor.toString(),
      '--input-button-active-color': accentColor.toString(),

      '--input-background': backgroundColor.toString(),
      '--input-hover-background': backgroundActiveColor.toString(),
      '--input-focused-background': backgroundActiveColor.toString(),

      '--input-border-color': borderColor.toString(),
      '--input-border-focused-color': borderActiveColor.toString(),
      '--input-border-hover-color': borderActiveColor.toString(),

      '--input-box-shadow-color': 'transparent',
      '--input-box-shadow-focused-color': boxShadow.toString(),
      '--input-box-shadow-hover-color': boxShadow.toString(),

      '--input-dropdown-item-color': textColor.toString(),
      '--input-dropdown-item-background': '#fff',
      '--input-dropdown-item-focused-color': dropdownItemColor.toString(),
      '--input-dropdown-item-focused-background': dropdownItemBackground.toString(),

      '--input-border-radius': '0.5em',

      '--input-text-color': textColor.toString(),
      '--input-text-focused-color': textColor.toString(),

      '--input-tag-border-color': tagBorderColor.toString(),
      '--input-tag-background': tagBackgroundColor.toString(),
      '--input-tag-color': tagTextColor.toString(),
    }
  }

  static defaultProps = {
    accent: '#b2abd2',
  }
}