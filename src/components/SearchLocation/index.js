import React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import SearchIcon from '../../asset/icons/search.svg';
import _ from 'lodash';
import AutoCompleted from '../AutoCompleted';
import useStyles from './styles';
import { withStyles } from '@material-ui/core/styles';

export default function CustomizedInputBase({ data, onSearch, resetLocation }) {
  const classes = useStyles();
  const [dataSearch, setData] = React.useState({});
  const [visibleInput, setvisibleInput] = React.useState(false);

  React.useEffect(() => {
    if (!_.isEmpty(dataSearch)) {
      onSearch(dataSearch);
    }
  }, [dataSearch]);

  const handleChangeValue = itemSelect => {
    const dataItem = data.filter(item => item.imei === itemSelect)[0];
    setData(dataItem);
    if (itemSelect === '') {
      resetLocation();
    }
  };
  const suggestions = () => {
    return data.map(item => ({
      id: item.id,
      label: item.imei
    }));
  };
  const onSearchIconClick = () => {
    setvisibleInput(x => !x);
  };

  const CollapseSlideLeft = withStyles(theme => ({
    container: {
      width: 0,
      transition: theme.transitions.create('width')
    },

    entered: {
      width: '100%'
    },

    hidden: {
      width: 0
    }
  }))(Collapse);

  return (
    <Paper className={classes.root}>
      {visibleInput && (
        <Box className={classes.inputBox}>
          <AutoCompleted
            suggestions={suggestions()}
            handleChangeValue={handleChangeValue}
            placeholder="Tìm kiếm theo serial thiết bị"
            label="Tìm kiếm theo serial thiết bị"
          />
        </Box>
      )}
      <IconButton
        onClick={onSearchIconClick}
        className={classes.iconButton}
        aria-label="search"
      >
        <img src={SearchIcon} alt="" />
      </IconButton>
    </Paper>
  );
}
