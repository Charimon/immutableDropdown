import React from 'react'
import Color from 'color'

export class _Input extends React.Component{
  static getAccentStyles = (accent) => {
    const accentColor = Color(accent);
    const accentLightColor = Color(accent).desaturate(0.2);
    const accentSuperLightColor = Color(accent).desaturate(0.2).lighten(0.2);
    const boxShadow = Color(accent);
    const textColor = Color(accent).desaturate(1).negate();
    const accentTextColor = Color(accent).isDark() ? Color("#fff") : Color("#000");
    const accentTextInvertColor = Color(accent).isLight() ? Color("#fff") : Color("#000");

    return {
      '--input-button-color': textColor.toString(),
      '--input-button-focused-color': accentLightColor.toString(),
      '--input-button-active-color': accentColor.toString(),

      '--input-background': accentTextInvertColor.toString(),
      '--input-hover-background': accentSuperLightColor.toString(),
      '--input-focused-background': accentSuperLightColor.toString(),

      '--input-border-color': textColor.toString(),
      '--input-border-focused-color': accentColor.toString(),
      '--input-border-hover-color': accentLightColor.toString(),

      '--input-box-shadow-color': 'transparent',
      '--input-box-shadow-focused-color': boxShadow.toString(),
      '--input-box-shadow-hover-color': boxShadow.toString(),

      '--input-dropdown-item-color': textColor.toString(),
      '--input-dropdown-item-background': '#fff',
      '--input-dropdown-item-focused-color': accentTextColor.toString(),
      '--input-dropdown-item-focused-background': accentColor.toString(),

      '--input-border-radius': '0.5em',

      '--input-text-color': textColor.toString(),
      '--input-text-focused-color': textColor.toString(),

      '--input-tag-border-color': accentColor.toString(),
      '--input-tag-background': accentLightColor.toString(),
      '--input-tag-color': accentTextColor.toString(),
    }
  }

  static defaultProps = {
    accent: '#b2abd2',
  }
}