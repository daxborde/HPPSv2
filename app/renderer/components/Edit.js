import React, { Component } from 'react';
import Template from './Template';
import { withStyles } from '@material-ui/core/styles';
import CustomTextField from './CustomTextField';
import CustomButton from './CustomButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
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
    justifyContent: 'flex-end',
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

      return x.map((x, index) => (
        <CustomTextField
          key={index}
          label={x}
          name={x}
          type='text'
          defaultValue={this.props[x]}
          className={classes.item}
          onBlur={this.props.handleChange}
        />
      ));
    };

    return (
      <Template title='Edit'>
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
              <CustomButton disabled={this.props.b1} onClick={this.props.onPrevious}>
                <NavigateBeforeIcon />
              </CustomButton>
              <CustomButton disabled={this.props.b2} onClick={this.props.onNext}>
                <NavigateNextIcon />
              </CustomButton>
            </div>
          </Card>
        </div>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Edit);
