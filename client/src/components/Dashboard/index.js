import React, { Component } from 'react';
import "./dashboard.css";

// libs
import { Input, Button } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from "react-router-dom";

// components
import Students from './Students/';
import Appointments from './Appointments/';
import Cars from './Cars/';
import Instructors from './Instructors/';

export default class extends Component {
  render() {
    let { match } = this.props;
    // console.log(match.url);

    return (
      <div className="dashboard-wrapper">
        <header className="header">
          <div>Metro Driving School Appointment Management System Dashboard</div>
          <a href="" onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            this.props.history.push("/signin");
          }}>Log out</a>
        </header>
        <div className="sidebar">
          <NavLink to={`${match.url}/students`} activeClassName="selected">Students</NavLink>
          <NavLink to={`${match.url}/appointments`} activeClassName="selected">Appointments</NavLink>
          <NavLink to={`${match.url}/cars`} activeClassName="selected">Cars</NavLink>
          <NavLink to={`${match.url}/instructors`} activeClassName="selected">Instructors</NavLink>
        </div>
        <div className="main">
          <Route exact path={`${match.url}`} render={(props) => (
            <Redirect to={{pathname: `/dashboard/students`}} />
          )} />
          <Route path={`${match.url}/students`} component={Students} />
          <Route path={`${match.url}/appointments`} component={Appointments} />
          <Route path={`${match.url}/cars`} component={Cars} />
          <Route path={`${match.url}/instructors`} component={Instructors} />
        </div>
      </div>

    );
  }
}
