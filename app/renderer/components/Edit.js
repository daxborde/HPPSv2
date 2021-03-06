import React, { Component } from 'react';
import Template from './Template';
import { withStyles } from '@material-ui/core/styles';
import CustomTextField from './CustomTextField';
import CustomButton from './CustomButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    margin: theme.spacing(0, 4, 0, 3),
    justifyContent: 'space-between',
  },
  photo: {
    flex: '45%',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    // background: 'red',
  },
  img: {
    position: 'sticky',
    height: 'calc(85vh)',
    objectFit: 'cover',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: '55%',
    padding: theme.spacing(4, 2, 4, 2),
    // background: 'green',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    marginBottom: theme.spacing(3),
  },
});

class Edit extends Component {
  render() {
    const { classes } = this.props;

    const list = (x) => {
      if (x === null) return null;

      return x.map((x, index) => {
        return(
          <CustomTextField
            key={`${index}+${this.props[x]}`}
            label={x}
            name={x}
            type='text'
            // autoFocus={index === 0}
            defaultValue={this.props[x]}
            className={classes.item}
            onBlur={this.props.handleChange}
          />
        )});
    };

    return (
      <Template title='Review'>
        <Snackbar
          open={this.props.manyerror}
          autoHideDuration={6000}
          key='manyerror'
          onClose={this.props.clearManyError}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}>
          <MuiAlert elevation={6} variant='filled' onClose={this.props.clearManyError} severity='error'>
            More than one search result!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.props.emptyerror}
          autoHideDuration={6000}
          key='emptyerror'
          onClose={this.props.clearEmptyError}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}>
          <MuiAlert elevation={6} variant='filled' onClose={this.props.clearEmptyError} severity='error'>
            No search results!
          </MuiAlert>
        </Snackbar>

        <div className={classes.wrapper}>
          <div key={this.props.imgPath} className={classes.photo}>
            <Card
              component='img'
              alt='headstone'
              className={classes.img}
              src={this.props.imgPath}
            />
          </div>
          <Card className={classes.form}>
            <div key={this.props.index}>{list(this.props.colNames)}</div>

            <div className={classes.buttons}>
              <div>
                <CustomButton onClick={this.props.onFinish}>
                  Finish
                </CustomButton>
              </div>
              <div>
                <CustomButton disabled={this.props.b1} onClick={this.props.onPrevious}>
                  <NavigateBeforeIcon />
                </CustomButton>
                <CustomButton disabled={this.props.b2} onClick={this.props.onNext}>
                  <NavigateNextIcon />
                </CustomButton>
              </div>
            </div>
          </Card>
        </div>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Edit);
