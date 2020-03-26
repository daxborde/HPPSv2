import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  input: {
    height: 50,
  },
}));

const CustomButton = (props) => {
  const classes = useStyles();

  return (
    <Button {...props} className={classes.input} variant='contained' color='primary'>
      {props.children}
    </Button>
  );
};

export default CustomButton;
