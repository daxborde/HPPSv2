import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  input: {
    height: 50,
  },
}));

const CustomTextField = (props) => {
  const classes = useStyles();

  return (
    <TextField {...props} InputProps={{ className: classes.input }} variant='outlined' fullWidth />
  );
};

export default CustomTextField;
