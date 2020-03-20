import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  input: {
    margin: theme.spacing(1),
    height: 38,
  },
  heroContent: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  // content: {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   // marginRight: '-50%',
  //   transform: 'translate(-50%, -50%)',
  // },
}));

function Template(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {/* AppBar*/}
      <Box className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Headstone Photo Processing System
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Hero unit */}
        <div className={classes.heroContent}>
          {/*<Container className={classes.content} maxWidth="md">*/}
          <Container maxWidth="md">{props.children}</Container>
        </div>
      </Box>
    </React.Fragment>
  );
}

export default Template;
