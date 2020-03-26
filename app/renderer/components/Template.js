import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: theme.spacing(8, 0, 6),
  },
}));

function Template(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position='relative'>
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <div className={classes.content}>{props.children}</div>
    </React.Fragment>
  );
}

export default Template;
