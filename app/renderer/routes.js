import React from 'react';
import { Route, Switch } from 'react-router';

import LoginPage from './containers/LoginPage';
import LoggedInPage from './containers/LoggedInPage';
import HomePage from './containers/HomePage';
import NewProjectPage from './containers/CreateProjectPage';

export default (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/new-project" component={NewProjectPage} />
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/loggedin" component={LoggedInPage} />
  </Switch>
);
