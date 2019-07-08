import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter} from "react-router-dom";
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import {ApolloLink} from 'apollo-link';
import {withClientState} from 'apollo-link-state';
import {ApolloProvider} from "react-apollo";
import gql from 'graphql-tag';
import 'react-dates/initialize';
import moment from 'moment';

import SignIn from './SignIn/';
import Dashboard from './Dashboard/';
import StudentEdit from './Dashboard/Students/EditModal';
import CarEdit from './Dashboard/Cars/EditModal';
import InstructorEditModal from './Dashboard/Instructors/EditModal';
import NewStudent from './Dashboard/Students/NewModal';
import NewCar from './Dashboard/Cars/NewModal';
import NewInstructorModal from './Dashboard/Instructors/NewModal';
import NewAppointmentModal from './Dashboard/Appointments/NewModal';
import ErrorModal from './ErrorModal';


function isAuthenticated() {
  // return true or false
  // get token from localstorage,
  // if token is null, return false
  // otherwise, return true
  let token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }

}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin"
          }}
        />
      )
    }
  />
);

export default class App extends Component {

  constructor() {
    super();

  }

  render() {

    return (
        <Router>
          <div className="wrapper">
            <Route path="/" exact render={props => {
              return (
                <Redirect to={{pathname: "/dashboard/"}}/>
              )
            }}/>

            <Route path="/signin" component={SignIn}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>

            {/* student modals */}
            <PrivateRoute path={`/dashboard/students/:id`} component={StudentEdit}/>
            <PrivateRoute exact path={`/new-student`} component={NewStudent}/>

            {/* appointment modals */}
            <PrivateRoute path={`/new-appointment`} component={NewAppointmentModal}/>
            <PrivateRoute path={`/appointment`} component={NewAppointmentModal}/>

            {/* car modals */}
            <PrivateRoute path={`/cars/:id`} component={CarEdit}/>
            <PrivateRoute path={`/new-car`} component={NewCar}/>

            {/* instructor modals */}
            <PrivateRoute path={`/instructors/:id`} component={InstructorEditModal}/>
            <PrivateRoute path={`/new-instructor`} component={NewInstructorModal}/>

            <ErrorModal />
          </div>
        </Router>
    );
  }
}
