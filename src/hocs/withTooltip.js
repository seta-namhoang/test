import React from 'react';
import {
  string,
  objectOf,
  number,
  shape,
  bool,
  oneOfType,
  arrayOf
} from 'prop-types';
import getDisplayName from 'recompose/getDisplayName';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const style = theme => ({
  customtooltip: {
    whiteSpace: 'pre-line',
    padding: '4px',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: '13px',
    lineHeight: '18px'
  }
});

const VeritoneToolTip = ({ text, style }) => <div style={style}>{text}</div>;

VeritoneToolTip.propTypes = {
  text: oneOfType([string, number]),
  style: objectOf(string, number)
};
const withToolTip = WrappedComponent => {
  class ComponentWithToolTip extends React.Component {
    static displayName = `WrappedWithAppConfig(${getDisplayName(
      WrappedComponent
    )})`;

    static propTypes = {
      classes: objectOf(string),
      tooltip: shape({
        text: oneOfType([string, number, arrayOf(string)]),
        style: objectOf(string, number),
        disabled: bool,
        placement: string
      })
    };

    render() {
      const { classes, tooltip, ...remainProps } = this.props;
      if (tooltip.disabled) {
        return <WrappedComponent {...remainProps} />;
      }
      return (
        <Tooltip
          title={<VeritoneToolTip text={tooltip.text} style={tooltip.style} />}
          placement={tooltip.placement}
          classes={{ tooltip: classes.customtooltip }}
        >
          <WrappedComponent {...remainProps} />
        </Tooltip>
      );
    }
  }
  return withStyles(style, { withTheme: true })(ComponentWithToolTip);
};
export default withToolTip;
