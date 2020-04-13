import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Template from './Template';
import { withStyles } from '@material-ui/core/styles';
import CustomTextField from './CustomTextField';
import CustomButton from './CustomButton';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    margin: theme.spacing(0, 4, 0, 3),
  },
  photo: {
    flex: '45%',
    background: 'red',
  },
  // img: {
  //   display: block,
  //   maxWidth: 100%,
  // },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: '55%',
    background: 'green',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  item: {
    marginTop: theme.spacing(3),
  },
});

class Edit extends Component {
  static propTypes = {
    onEdit: PropTypes.func.isRequired,
  };

  state = {
    imagePath: '',
    data: [['first', 'john'], ['middle', 'e'], ['last', 'doe']],
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  handleEdit = () => {
    this.props.onEdit({
      data: this.state.data,
    });
  };

  render() {
    const { classes } = this.props;
    const foo = this.state.data.map((x, index) => (
      <CustomTextField
        key={index}
        label={x[0]}
        name={x[0]}
        type='text'
        defaultValue={x[1]}
        className={classes.item}
        onBlur={this.handleChange}
      />
    ));

    return (
      <Template title='Edit'>
        {/*<div className={classes.wrapper}>*/}
        <div className={classes.wrapper}>
          <div className={classes.photo}>
            <img src={this.state.imagePath} />
          </div>
          <div className={classes.form}>
            {foo}

            <div className={classes.buttons}>
              <CustomButton onClick={this.handleEdit}>Previous</CustomButton>
              <CustomButton onClick={this.handleEdit}>Next</CustomButton>
            </div>
          </div>
        </div>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Edit);
