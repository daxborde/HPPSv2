import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  title: {
    flexGrow: 1,
  },
  content: {
    margin: theme.spacing(8, 0, 6),
  },
}));

const Template = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      {/* AppBar */}
      <div className={classes.root}>
        <AppBar position='relative'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
              {props.title}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <div className={classes.content}>{props.children}</div>
      </div>
    </React.Fragment>
  );
};

export default Template;
