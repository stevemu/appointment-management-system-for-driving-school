import React, {Component} from 'react';
import {Input, Button, Loader, Dimmer} from 'semantic-ui-react';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import 'react-dates/lib/css/_datepicker.css';
import queryString from '../../../query-string';
import moment from 'moment';

import './appointment.css';

import NewButton from '../lib/NewButton';
import TableByDate from './TableByDate';
import DatePicker from './DatePicker';

import SelectionArea from './SelectionArea';

export default class extends Component {
  constructor() {
    super();

    this.state = {
      focused: false
    }
  }

  render() {
    // return <div>Under construction</div>

    return (
      <Query query={gql`
        query {
            currentDateSelection @client
        }
      `}>
        {({data, client}) => {
          // this.client = client;
          // let mDate = moment(data.currentDateSelection, "L");

          return <div className="dashboard-main-wrapper appointment-home">
            <NewButton
              {...this.props}
              route={"/new-appointment"}
              text="New Appointment"
            />
            <div className="filter">
              <DatePicker/>
              <SelectionArea/>
            </div>
            <TableByDate
              rowClickHandler={(item) => {
                let {student, ...appt} = item;
                let query = queryString.stringify(appt);
                this.props.history.push(`/appointment?${query}`);
              }}
            />
          </div>
        }}

      </Query>
    )
  }
}
